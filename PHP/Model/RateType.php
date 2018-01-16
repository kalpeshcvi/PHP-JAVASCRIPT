<?php

namespace FM\ApiBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use FM\ApiBundle\Entity\Traits\TimestampableEntity;

/**
 * RateType
 *
 * @ORM\Table(name="rate_type")
 * @ORM\Entity(repositoryClass="FM\ApiBundle\Repository\RateTypeRepository")
 * 
 * @ORM\HasLifecycleCallbacks()
 */
class RateType
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
     * @var int
     * 
     * @ORM\ManyToOne(targetEntity="RateCategory")
     * @ORM\JoinColumn(name="rate_category_id", referencedColumnName="id", nullable=false, onDelete="RESTRICT")
     * @Assert\NotBlank(groups={"create"})
     */
    private $category;

    /**
     * @var string
     * 
     * @ORM\Column(name="name", type="string", length=64)
     * @Assert\NotBlank(groups={"create"})
     * @Assert\Length(max = 64, maxMessage = "Can not be longer than {{ limit }} characters", groups={"create"})
     */
    private $name;

    /**
     * to array
     * 
     * @return array
     */
    public function toArray()
    {
        return [
            'id' => $this->getId(),
            'name' => $this->getName(),
            'category' => [
                'id' => $this->getCategory() ? $this->getCategory()->getId() : null,
                'name' => $this->getCategory() ? $this->getCategory()->getName() : null,
            ],
        ];
    }

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
     * @return RateType
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

    /**
     * Set category
     *
     * @param \FM\ApiBundle\Entity\RateCategory $category
     *
     * @return RateType
     */
    public function setCategory(\FM\ApiBundle\Entity\RateCategory $category= null)
    {
        $this->category = $category;

        return $this;
    }

    /**
     * Get category
     *
     * @return \FM\ApiBundle\Entity\RateCategory
     */
    public function getCategory()
    {
        return $this->category;
    }

}
