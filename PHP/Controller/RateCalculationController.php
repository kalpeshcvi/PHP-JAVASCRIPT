<?php

namespace FM\ApiBundle\Controller;

use FOS\RestBundle\Controller\Annotations as FOSRest;
use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;

use Nelmio\ApiDocBundle\Annotation\ApiDoc;

use FM\ApiBundle\Services\Traits\ResponseTrait;

class RateCalculationController extends FOSRestController
{
    
    use ResponseTrait;
    
    /**
     * Get rate from job, Allowed Roles : ROLE_CLIENT | ROLE_SCHEDULER
     * 
     * @ApiDoc(
     *      resource=true,
     *      description="Get rate from job, Allowed Roles : ROLE_CLIENT | ROLE_SCHEDULER",
     *      resourceDescription="Get rate from job",
     *      headers={
     *          {
     *              "name"="Authorization",
     *              "required"=true,
     *              "description"="Bearer <oAuth token>"
     *          }
     *      },
     *      statusCodes={
     *          200="Returned when successful",
     *          400="Returned when the form has errors"
     *      }
     * )
     * 
     * @FOSRest\Get("/job/rate/{jobId}")
     * 
     * @Security(" has_role('ROLE_CLIENT') or has_role('ROLE_SCHEDULER') ")
     */
    public function getJobRateAction($jobId)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $job = $em->getRepository('FM\ApiBundle\Entity\Job')->find($jobId);
        
        $data = [];
        
        if(!empty($job) && !empty($job->getJobRequest())) {
            
            $provider = $job->getJobRequest()->getProvider();

            $param = [
                'copies' => $job->getCopies(),
                'pagesPerHour' => $job->getPagesPerHour(),
                'realTimeConnection' => $job->getLiveConnection(),
                'startDateTime' => $job->getStartDate()->format('Y-m-d H:s'),
                'endDateTime' => $job->getEndDate()->format('Y-m-d H:s'),
            ];

            $data['rate'] = $this->container->get('fm_api.rate_calculation_manager')->getRateCalculation($provider, $param);
            
            $message = $this->container->get('translator')->trans('success.jobRateCalculation', [], 'ratecalculation');

            return $this->successJsonResponse(200, $message, $data);
        } else {
            $message = $this->container->get('translator')->trans('error.jobRateJobNotFound', [], 'ratecalculation');

            return $this->errorJsonResponse(200, $message, $data,$errors=[]);
        }
    }
}