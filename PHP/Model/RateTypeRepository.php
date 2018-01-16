<?php

namespace FM\ApiBundle\Repository;

/**
 * RateTypeRepository
 */
class RateTypeRepository extends \Doctrine\ORM\EntityRepository
{
    /**
     * Get all rate type ID & name
     * 
     * @return type
     */
    public function getAllRateType()
    {

        return $this->createQueryBuilder('rt')
                        ->select('rt.id, rt.name, rc.id as rate_category_id, rc.name as rate_category_name')
                        ->leftJoin('rt.category', 'rc')
                        ->orderBy('rt.name', 'ASC')
                        ->getQuery()
                        ->getArrayResult();
    }
}