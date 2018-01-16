<?php

namespace FM\ApiBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use FM\ApiBundle\Entity\Traits\TimestampableEntity;

/**
 * RateCategory
 *
 * @ORM\Table(name="rate_category")
 * @ORM\Entity(repositoryClass="FM\ApiBundle\Repository\RateCategoryRepository")
 * 
 * @ORM\HasLifecycleCallbacks()
 */
class RateCategory
{
    
    use TimestampableEntity;
    
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;
    
    /**
     * @var string
     * 
     * @ORM\Column(name="name", type="string", length=64)
     * @Assert\NotBlank(groups={"create"})
     * @Assert\Length(max = 64, maxMessage = "Can not be longer than {{ limit }} characters", groups={"create"})
     */
    private $name;


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return RateCategory
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }
}
