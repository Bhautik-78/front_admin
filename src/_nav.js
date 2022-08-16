export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'NEW',
      },
    },
    {
      name: "User Campaign",
      url: '/userCampaign',
      icon: 'icon-speedometer',
      children: [
        {
          name: 'Accounts',
          url: '/userCampaign/accounts',
          icon: 'icon-speedometer',
        },
        {
          name: 'Users',
          url: '/userCampaign/users',
          icon: 'icon-speedometer',
        },
        {
          name: 'Customers',
          url: '/userCampaign/customers',
          icon: 'icon-speedometer',
        },
        {
          name: 'Setting',
          url: '/userCampaign/setting',
          icon: 'icon-speedometer',
        },
      ]
    },
    {
      name: 'GTC',
      url: '/Geo_target_constant',
      icon: 'icon-speedometer',
    },
    {
      name: 'Application',
      url: '/application',
      icon: 'icon-speedometer',
    },
    {
      name: 'Criterion',
      url: '/campaign_criterion',
      icon: 'icon-speedometer',
    },
    {
      name: 'Manage Campaign',
      url: '/finalCampaign',
      icon: 'icon-speedometer',
    },
    {
      name: 'Update Campaign',
      url: '/latestCampaign',
      icon: 'icon-speedometer',
    },
    {
      name: 'Excel Converter',
      url: '/excelConverter',
      icon: 'icon-speedometer',
    },
    {
      name: 'Campaign',
      url: '/campaign',
      icon: 'icon-speedometer',
    },
    {
      name: 'New Dashboard',
      url: '/allCampaign',
      icon: 'icon-speedometer',
    },
    // {
    //   name: 'New Campaign',
    //   url: '/newCampaign',
    //   icon: 'icon-speedometer',
    // },
  ]
};
