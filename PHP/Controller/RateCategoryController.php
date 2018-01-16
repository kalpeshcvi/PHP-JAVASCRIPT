<?php

namespace FM\ApiBundle\Controller;

use FOS\RestBundle\Controller\Annotations as FOSRest;
use FOS\RestBundle\Controller\FOSRestController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Symfony\Component\HttpFoundation\Request;
use FM\ApiBundle\Entity\RateCategory;

/**
 * RateCategoryController
 */
class RateCategoryController extends FOSRestController
{

    use \FM\ApiBundle\Services\Traits\ResponseTrait;

    /**
     * Get all rate category
     * 
     * @ApiDoc(
     *      resource=true,
     *      description="Get all rate category, Allowed Roles : ROLE_API",
     *      resourceDescription="Get all rate category, Allowed Roles : ROLE_API",
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
     * @FOSRest\Get("/ratecategory")
     */
    public function getRateCategoryAction()
    {
        $em = $this->getDoctrine()->getEntityManager();
        $rateCategory = $em->getRepository('FM\ApiBundle\Entity\RateCategory')->getAllRateCategory();

        $message = $this->container->get('translator')->trans('success.allRateCategory', [], 'rateCategory');
        $data['records'] = $rateCategory;
        $data['total_records'] = count($rateCategory);

        return $this->successJsonResponse(200, $message, $data);
    }

    /**
     * Add new rate category
     *
     * @ApiDoc(
     *      resource=true,
     *      description="Add new rate category, Allowed Roles : ROLE_API",
     *      resourceDescription="Add new rate category, Allowed Roles : ROLE_API",
     *      input="HelthaApiBundle\Form\RateCategoryType",
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
     *              "name"="name",
     *              "dataType"="string",
     *              "required"=true,
     *              "description"="Rate category"
     *          },
     *      }
     * )
     * 
     * @Security("has_role('ROLE_API')")
     *
     * @FOSRest\Post("/ratecategory")
     *
     * @param Request $request http request object
     * 
     * @return JsonArray
     */
    public function postRateCategoryAction(Request $request)
    {
        $rateCategory = new RateCategory();

        $form = $this->createForm('FM\ApiBundle\Form\RateCategoryType', $rateCategory);

        return $this->container->get('fm_api.rate_category_manager')->addORUpdateRateCategory($request, $form);
    }

    /**
     * edit rate category
     *
     * @ApiDoc(
     *      resource=true,
     *      description="edit rate category, Allowed Roles : ROLE_API",
     *      resourceDescription="edit rate category, Allowed Roles : ROLE_API",
     *      input="HelthaApiBundle\Form\RateCategoryType",
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
     *          404="Returned when not found",
     *          500="Returned when internal server error",
     *      },
     *      parameters={
     *          {
     *              "name"="name",
     *              "dataType"="string",
     *              "required"=true,
     *              "description"="Rate category"
     *          },
     *      }
     * )
     * 
     * @Security("has_role('ROLE_API')")
     *
     * @FOSRest\Put("/ratecategory/{id}/edit",
     *      requirements={"id" = "\d+"},
     * )
     *
     * @param Request $request http request object
     * @param integer $id Rate category ID
     * 
     * @return JsonArray
     */
    public function putRateCategoryAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $rateCategory = $em->getRepository('FM\ApiBundle\Entity\RateCategory')->find($id);

        if ($rateCategory) {

            $form = $this->createForm('FM\ApiBundle\Form\RateCategoryType', $rateCategory);

            return $this->container->get('fm_api.rate_category_manager')->addORUpdateRateCategory($request, $form);
        } else {

            $message = $this->container->get('translator')->trans('error.notFound', [], 'rateCategory');

            return $this->errorJsonResponse(404, $message, [], []);
        }
    }

    /**
     * delete rate category
     *
     * @ApiDoc(
     *      resource=true,
     *      description="delete rate category, Allowed Roles : ROLE_API",
     *      resourceDescription="delete rate category, Allowed Roles : ROLE_API",
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
     * @FOSRest\Delete("/ratecategory/{id}/delete",
     *      requirements={"id" = "\d+"},
     * )
     * 
     * @Security("has_role('ROLE_API')")
     *
     * @param integer $id Rate Category ID
     * 
     * @return JsonArray
     */
    public function deleteRateCategoryAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $rateCategory = $em->getRepository('FM\ApiBundle\Entity\RateCategory')->find($id);

        if ($rateCategory) {

            $em->remove($rateCategory);
            $em->flush();

            $message = $this->container->get('translator')->trans('success.delete', [], 'rateCategory');
            return $this->successJsonResponse(200, $message, []);
        } else {

            $message = $this->container->get('translator')->trans('error.notFound', [], 'rateCategory');

            return $this->errorJsonResponse(404, $message, [], []);
        }
    }

}
