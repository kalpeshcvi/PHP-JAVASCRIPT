<?php

namespace FM\ApiBundle\Controller;

use FOS\RestBundle\Controller\Annotations as FOSRest;
use FOS\RestBundle\Controller\FOSRestController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Symfony\Component\HttpFoundation\Request;
use FM\ApiBundle\Entity\RateService;

/**
 * RateServiceController
 */
class RateServiceController extends FOSRestController
{
    
    use \FM\ApiBundle\Services\Traits\ResponseTrait;
    
    /**
     * Get all rate service
     * 
     * @ApiDoc(
     *      resource=true,
     *      description="Get all rate service, Allowed Roles : ROLE_API",
     *      resourceDescription="Get all rate service, Allowed Roles : ROLE_API",
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
     * @Security("has_role('ROLE_API')")
     * 
     * @FOSRest\Get("/rateservice")
     */
    public function getRateServiceAction()
    {
        $em = $this->getDoctrine()->getEntityManager();
        $rateType = $em->getRepository('FM\ApiBundle\Entity\RateService')->getAllRateService();
        
        $records = $this->container->get('fm_api.rate_service_manager')->getAllRateServiceData($rateType);

        $message = $this->container->get('translator')->trans('success.allRateType', [], 'rateService');
        $data['records'] = $records;
        $data['total_records'] = count($records);

        return $this->successJsonResponse(200, $message, $data);
    }
    
    /**
     * Add new rate service
     *
     * @ApiDoc(
     *      resource=true,
     *      description="Add new rate service, Allowed Roles : ROLE_API",
     *      resourceDescription="Add new rate service, Allowed Roles : ROLE_API",
     *      input="HelthaApiBundle\Form\RateServiceType",
     *      headers={
     *          {
     *              "name"="Authorization",
     *              "required"=true,
     *              "description"="Bearer <oAuth token>"
     *          }
     *      },
     *      statusCodes={
     *          200="Returned when successful",
     *          400="Returned when the form has errors",
     *          500="Returned when internal server error",
     *      },
     *      parameters={
     *          {
     *              "name"="itemName",
     *              "dataType"="string",
     *              "required"=true,
     *              "description"="Rate service item name"
     *          },
     *          {
     *              "name"="uniqueServiceName",
     *              "dataType"="string",
     *              "required"=true,
     *              "description"="unique service name"
     *          },
     *          {
     *              "name"="group",
     *              "dataType"="integer",
     *              "required"=true,
     *              "description"="Rate service group, NOTE : 1 = Service Item, 2 = Expendites, 3 = Other Items"
     *          },
     *          {
     *              "name"="allowUnitChange",
     *              "dataType"="boolean",
     *              "required"=true,
     *              "description"="Rate service allow unit change, NOTE : true / false"
     *          },
     *          {
     *              "name"="allowTypeChange",
     *              "dataType"="boolean",
     *              "required"=true,
     *              "description"="Rate service allow type change, NOTE : true / false"
     *          },
     *          {
     *              "name"="typeGroup",
     *              "dataType"="integer",
     *              "required"=true,
     *              "description"="reference of typeGroup from 1 to 7"
     *          },
     *          {
     *              "name"="type",
     *              "dataType"="integer",
     *              "required"=true,
     *              "description"="reference of rate type for default type set"
     *          },
     *          {
     *              "name"="category",
     *              "dataType"="integer",
     *              "required"=true,
     *              "description"="reference of rate category"
     *          },
     *          {
     *              "name"="isBaseRate",
     *              "dataType"="boolean",
     *              "required"=true,
     *              "description"="base rate, Note : true / false"
     *          },
     *      }
     * )
     * 
     * @Security("has_role('ROLE_API')")
     *
     * @FOSRest\Post("/rateservice")
     *
     * @param Request $request http request object
     * 
     * @return JsonArray
     */
    public function postRateServiceAction(Request $request)
    {
        $rateService = new RateService();
        
        $form = $this->createForm('FM\ApiBundle\Form\RateServiceType', $rateService);
        
        return $this->container->get('fm_api.rate_service_manager')->addORUpdateRateService($request, $form);
    }
    
    /**
     * edit rate service
     *
     * @ApiDoc(
     *      resource=true,
     *      description="edit rate service, Allowed Roles : ROLE_API",
     *      resourceDescription="edit rate service, Allowed Roles : ROLE_API",
     *      input="HelthaApiBundle\Form\RateServiceType",
     *      headers={
     *          {
     *              "name"="Authorization",
     *              "required"=true,
     *              "description"="Bearer <oAuth token>"
     *          },
     *          {
     *              "name"="Content-Type",
     *              "required"=true,
     *              "description"="application/x-www-form-urlencoded"
     *          },
     *      },
     *      statusCodes={
     *          200="Returned when successful",
     *          400="Returned when the form has errors",
     *          500="Returned when internal server error",
     *      },
     *      parameters={
     *          {
     *              "name"="itemName",
     *              "dataType"="string",
     *              "required"=true,
     *              "description"="Rate service item name"
     *          },
     *          {
     *              "name"="uniqueServiceName",
     *              "dataType"="string",
     *              "required"=true,
     *              "description"="Unique service name"
     *          },
     *          {
     *              "name"="group",
     *              "dataType"="integer",
     *              "required"=true,
     *              "description"="Rate service group, NOTE : 1 = Service Item, 2 = Expendites, 3 = Other Items"
     *          },
     *          {
     *              "name"="allowUnitChange",
     *              "dataType"="boolean",
     *              "required"=true,
     *              "description"="Rate service allow unit change, NOTE : 1 / 0"
     *          },
     *          {
     *              "name"="allowTypeChange",
     *              "dataType"="boolean",
     *              "required"=true,
     *              "description"="Rate service allow type change, NOTE : 1 / 0"
     *          },
     *          {
     *              "name"="typeGroup",
     *              "dataType"="integer",
     *              "required"=true,
     *              "description"="typeGroup form 1 to 7"
     *          },
     *          {
     *              "name"="type",
     *              "dataType"="integer",
     *              "required"=true,
     *              "description"="reference of rate type for default type set"
     *          },
     *          {
     *              "name"="category",
     *              "dataType"="integer",
     *              "required"=true,
     *              "description"="reference of rate category"
     *          },
     *          {
     *              "name"="isBaseRate",
     *              "dataType"="boolean",
     *              "required"=true,
     *              "description"="base rate, Note : 1 / 0"
     *          },
     *      }
     * )
     * 
     * @Security("has_role('ROLE_API')")
     *
     * @FOSRest\Put("/rateservice/{id}/edit",
     *      requirements={"id" = "\d+"},
     * )
     *
     * @param Request $request http request object
     * @param integer $id Rate service ID
     * 
     * @return JsonArray
     */
    public function putRateServiceAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $rateService = $em->getRepository('FM\ApiBundle\Entity\RateService')->find($id);
        
        if ($rateService) {

            $form = $this->createForm('FM\ApiBundle\Form\RateServiceType', $rateService);

            return $this->container->get('fm_api.rate_service_manager')->addORUpdateRateService($request, $form);
        } else {

            $message = $this->container->get('translator')->trans('error.notFound', [], 'rateService');

            return $this->errorJsonResponse(404, $message, [], []);
        }
    }
    
    /**
     * delete rate service
     *
     * @ApiDoc(
     *      resource=true,
     *      description="delete rate service, Allowed Roles : ROLE_API",
     *      resourceDescription="delete rate service, Allowed Roles : ROLE_API",
     *      headers={
     *          {
     *              "name"="Authorization",
     *              "required"=true,
     *              "description"="Bearer <oAuth token>"
     *          },
     *      },
     *      statusCodes={
     *          200="Returned when successful",
     *          404="Returned when not found"
     *      },
     * )
     *
     * @FOSRest\Delete("/rateservice/{id}/delete",
     *      requirements={"id" = "\d+"},
     * )
     * 
     * @Security("has_role('ROLE_API')")
     *
     * @param integer $id Rate Type ID
     * 
     * @return JsonArray
     */
    public function deleteRateServiceAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $rateService = $em->getRepository('FM\ApiBundle\Entity\RateService')->find($id);

        if ($rateService) {

            $em->remove($rateService);
            $em->flush();

            $message = $this->container->get('translator')->trans('success.delete', [], 'rateService');
            return $this->successJsonResponse(200, $message, []);
        } else {

            $message = $this->container->get('translator')->trans('error.notFound', [], 'rateService');

            return $this->errorJsonResponse(404, $message, [], []);
        }
    }
    
}
