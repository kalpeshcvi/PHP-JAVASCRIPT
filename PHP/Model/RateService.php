<?php

namespace FM\ApiBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use FM\ApiBundle\Entity\Traits\TimestampableEntity;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * RateService
 *
 * @ORM\Table(name="rate_service",
 *      uniqueConstraints={
 *              @ORM\UniqueConstraint(name="provider_rate_idx", 
 *              columns={"item_name", "rate_category_id", "group_name"})
 * })
 * 
 * @UniqueEntity( 
 *      fields={"itemName", "category", "group"},
 *      message="Item already exists",
 *      groups={"create"}
 * )
 * 
 * @UniqueEntity( 
 *      fields={"uniqueServiceName"},
 *      message="Service Name already exists",
 *      groups={"create"}
 * )
 * 
 * @ORM\Entity(repositoryClass="FM\ApiBundle\Repository\RateServiceRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class RateService
{

    use TimestampableEntity;

    const GROUP_SERVICE_ITEM = 1;
    const GROUP_EXPENDITES = 2;
    const GROUP_OTHER_ITEMS = 3;

    private $groupCaptions = [
        self::GROUP_SERVICE_ITEM => 'Service Item',
        self::GROUP_EXPENDITES => 'Expendites',
        self::GROUP_OTHER_ITEMS => 'Other Items'
    ];

    
    const TYPEGROUP_PAGE_SESSION = 1;
    const TYPEGROUP_HOURLY_SESSION = 2;
    const TYPEGROUP_SESSION_PARTICIPANT_PAGE = 3;
    const TYPEGROUP_HOUR_MILE = 4;
    const TYPEGROUP_LAPTOP_TABLET = 5;
    const TYPEGROUP_PAGE_HOUR = 6;
    const TYPEGROUP_AMOUNT = 7;

    const TYPE_PAGE = 1;
    const TYPE_SESSION = 2;
    const TYPE_HOURLY = 3;
    const TYPE_SESSIONPAGE = 4;
    const TYPE_PARTICIPANTPAGE = 5;
    const TYPE_HOUR = 6;
    const TYPE_MILE = 7;
    const TYPE_LAPTOP = 8;
    const TYPE_TABLET = 9;
    const TYPE_AMOUNT = 10;
    
    private $typeGroupList = [
            self::TYPEGROUP_PAGE_SESSION => [
                self::TYPE_PAGE => 'type.page',
                self::TYPE_SESSION => 'type.session',
            ],
            self::TYPEGROUP_HOURLY_SESSION => [
                self::TYPE_SESSION => 'type.session',
                self::TYPE_HOURLY => 'type.hourly',
            ],
            self::TYPEGROUP_SESSION_PARTICIPANT_PAGE => [
                self::TYPE_SESSIONPAGE => 'type.sessionpage',
                self::TYPE_PARTICIPANTPAGE => 'type.participantpage',
            ],
            self::TYPEGROUP_HOUR_MILE => [
                self::TYPE_HOUR => 'type.hour',
                self::TYPE_MILE => 'type.mile',
            ],
            self::TYPEGROUP_LAPTOP_TABLET => [
                self::TYPE_LAPTOP => 'type.laptop',
                self::TYPE_TABLET => 'type.tablet',
            ],
            self::TYPEGROUP_PAGE_HOUR => [
                self::TYPE_PAGE => 'type.page',
                self::TYPE_HOUR => 'type.hour',
            ],
            self::TYPEGROUP_AMOUNT => [
                self::TYPE_AMOUNT => 'type.amount',
            ],
    ];
    
    private $typeCaptions = [
        self::TYPE_PAGE => 'type.page',
        self::TYPE_SESSION => 'type.session',
        self::TYPE_HOURLY => 'type.hourly',
        self::TYPE_SESSIONPAGE => 'type.sessionpage',
        self::TYPE_PARTICIPANTPAGE => 'type.participantpage',
        self::TYPE_HOUR => 'type.hour',
        self::TYPE_MILE => 'type.mile',
        self::TYPE_LAPTOP => 'type.laptop',
        self::TYPE_TABLET => 'type.tablet',
        self::TYPE_AMOUNT => 'type.amount',
    ];
    
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
     * @var int
     * 
     * @ORM\Column(name="type_group_id", type="smallint", nullable=false)
     * @Assert\NotBlank(groups={"create"})
     * @Assert\Type(type="integer", groups={"create"})
     */
    private $typeGroup;
    
    /**
     * @var int
     * 
     * @ORM\Column(name="rate_type_id", type="smallint", nullable=false)
     * @Assert\NotBlank(groups={"create"})
     * @Assert\Type(type="integer", groups={"create"})
     */
    private $type;

    /**
     * @var string
     * 
     * @ORM\Column(name="item_name", type="string", length=64, unique=true)
     * @Assert\NotBlank(groups={"create"})
     * @Assert\Length(max = 64, maxMessage = "Can not be longer than {{ limit }} characters", groups={"create"})
     */
    private $itemName;
    
    /**
     * @var string
     * 
     * @ORM\Column(name="unique_service_name", type="string", length=64, unique=true)
     * @Assert\NotBlank(groups={"create"})
     * @Assert\Length(max = 64, maxMessage = "Can not be longer than {{ limit }} characters", groups={"create"})
     */
    private $uniqueServiceName;

    /**
     * @var smallint
     * 
     * @ORM\Column(name="group_name", type="smallint")
     * @Assert\NotBlank(groups={"create"})
     * @Assert\Type(type="integer", groups={"create"})
     */
    private $group;

    /**
     * @var string
     * 
     * @ORM\Column(name="allow_unit_change", type="string", length=10)
     * @Assert\NotBlank(groups={"create"})
     * @Assert\Choice(choices = {"true", "false"}, message = "Choose a valid option.", groups={"create"})
     */
    private $allowUnitChange = false;

    /**
     * @var string
     * 
     * @ORM\Column(name="allow_type_change", type="string", length=10)
     * @Assert\NotBlank(groups={"create"})
     * @Assert\Choice(choices = {"true", "false"}, message = "Choose a valid option.", groups={"create"})
     */
    private $allowTypeChange = false;

    /**
     * @var string
     * 
     * @ORM\Column(name="is_base_rate", type="string", length=10)
     * @Assert\NotBlank(groups={"create"})
     * @Assert\Choice(choices = {"true", "false"}, message = "Choose a valid option.", groups={"create"})
     */
    private $isBaseRate = false;

    /**
     * get type group
     * 
     * @return array
     */
    public function getTypeGroupList()
    {
        return $this->typeGroupList;
    }
    
    /**
     * get type group
     * 
     * @return array
     */
    public function getTypeCaptions()
    {
        return $this->typeCaptions;
    }
    
    /**
     * get group caption
     * 
     * @return array
     */
    public function getGroupCaption()
    {
        return [
            'id' => $this->group ? $this->group : null,
            'caption' => $this->group ? $this->groupCaptions[$this->group] : null,
        ];
    }
    
    /**
     * get group caption
     * 
     * @return array
     */
    public function getGroupCaptions()
    {
        return $this->groupCaptions;
    }

    /**
     * to array
     * 
     * @return array
     */
    public function toArray()
    {
        return [
            'id' => $this->getId(),
            'name' => $this->getItemName(),
            'category' => [
                'id' => $this->getCategory() ? $this->getCategory()->getId() : null,
                'name' => $this->getCategory() ? $this->getCategory()->getName() : null,
            ],
            'typeGroup' => $this->getTypeGroup(),
            'type' => $this->getType(),
            'group' => $this->getGroupCaption(),
            'allow_unit_change' => $this->getAllowUnitChange(),
            'allow_type_change' => $this->getAllowTypeChange(),
            'is_base_rate' => $this->getIsBaseRate(),
        ];
    }

    /**
     * constructor
     */
    public function __construct()
    {
        $this->allowUnitChange = false;
        $this->allowTypeChange = false;
        $this->isBaseRate = false;
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set itemName
     *
     * @param string $itemName
     *
     * @return RateService
     */
    public function setItemName($itemName)
    {
        $this->itemName = $itemName;

        return $this;
    }

    /**
     * Get itemName
     *
     * @return string
     */
    public function getItemName()
    {
        return $this->itemName;
    }

    /**
     * Set group
     *
     * @param integer $group
     *
     * @return RateService
     */
    public function setGroup($group)
    {
        $this->group = $group;

        return $this;
    }

    /**
     * Get group
     *
     * @return integer
     */
    public function getGroup()
    {
        return $this->group;
    }

    /**
     * Set allowUnitChange
     *
     * @param boolean $allowUnitChange
     *
     * @return RateService
     */
    public function setAllowUnitChange($allowUnitChange)
    {
        $this->allowUnitChange = $allowUnitChange;

        return $this;
    }

    /**
     * Get allowUnitChange
     *
     * @return boolean
     */
    public function getAllowUnitChange()
    {
        return $this->allowUnitChange;
    }

    /**
     * Set allowTypeChange
     *
     * @param boolean $allowTypeChange
     *
     * @return RateService
     */
    public function setAllowTypeChange($allowTypeChange)
    {
        $this->allowTypeChange = $allowTypeChange;

        return $this;
    }

    /**
     * Get allowTypeChange
     *
     * @return boolean
     */
    public function getAllowTypeChange()
    {
        return $this->allowTypeChange;
    }

    /**
     * Set isBaseRate
     *
     * @param boolean $isBaseRate
     *
     * @return RateService
     */
    public function setIsBaseRate($isBaseRate)
    {
        $this->isBaseRate = $isBaseRate;

        return $this;
    }

    /**
     * Get isBaseRate
     *
     * @return boolean
     */
    public function getIsBaseRate()
    {
        return $this->isBaseRate;
    }

    /**
     * Set category
     *
     * @param \FM\ApiBundle\Entity\RateCategory $category
     *
     * @return RateService
     */
    public function setCategory(\FM\ApiBundle\Entity\RateCategory $category = null)
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

    /**
     * Set type
     *
     * @param $type
     *
     * @return RateService
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get type
     *
     * @return typeGroup
     */
    public function getType()
    {
        return $this->type;
    }
    
    /**
     * Set typeGroup
     *
     * @param $typeGroup
     *
     * @return RateService
     */
    public function setTypeGroup($typeGroup)
    {
        $this->typeGroup = $typeGroup;

        return $this;
    }

    /**
     * Get type Group
     *
     * @return typeGroup
     */
    public function getTypeGroup()
    {
        return $this->typeGroup;
    }


    /**
     * Set uniqueServiceName
     *
     * @param string $uniqueServiceName
     *
     * @return RateService
     */
    public function setUniqueServiceName($uniqueServiceName)
    {
        $this->uniqueServiceName = $uniqueServiceName;

        return $this;
    }

    /**
     * Get uniqueServiceName
     *
     * @return string
     */
    public function getUniqueServiceName()
    {
        return $this->uniqueServiceName;
    }
}
