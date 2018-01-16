<?php

namespace FM\ApiBundle\Repository;

/**
 * RateCategoryRepository
 */
class RateCategoryRepository extends \Doctrine\ORM\EntityRepository
{
    
    /**
     * Get all rate category ID & name
     * 
     * @return type
     */
    public function getAllRateCategory()
    {

        return $this->createQueryBuilder('rc')
                        ->select('rc.id, rc.name')
                        ->orderBy('rc.name', 'ASC')
                        ->getQuery()
                        ->getArrayResult();
    }
    
}
