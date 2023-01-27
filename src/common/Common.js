import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
export default {
apps: {
    android: 'https://play.google.com/store/apps/details?id=com.jiph',
    ios: 'https://apps.apple.com/us/app/jiph/id1659594247',
    huawei: 'https://play.google.com/store/apps/details?id=com.jiph'
  },
  socialIcons: [{
    icon: <FontAwesomeIcon icon="fa-brands fa-facebook" />,
    url: 'https://www.facebook.com/Jiph'
  }, {
    icon: <FontAwesomeIcon icon="fa-brands fa-twitter" />,
    url: 'https://twitter.com/Jiph'
  }, {
    icon: <FontAwesomeIcon icon="fa-brands fa-instagram" />,
    url: 'https://www.instagram.com/Jiphph/'
  }, {
    icon: <FontAwesomeIcon icon="fa-brands fa-linkedin" />,
    url: 'https://www.linkedin.com/company/Jiph/'
  }, {
    icon: <FontAwesomeIcon icon="fa-brands fa-youtube" />,
    url: 'https://www.youtube.com/channel/UCVMW6yib0N2aABETzcHYkpg'
  }],
  footerMenus: [{
    title: 'Jiph',
    route: null,
    subMenu: [{
      title: 'Services',
      route: '/services',
      type: 'internal'
    }, {
      title: 'Locations',
      route: '/locations',
      type: 'internal'
    }, {
      title: 'Charges',
      route: '/charges',
      type: 'internal'
    }, {
      title: 'Careers',
      route: '/careers',
      type: 'internal'
    }
  ]
  }, {
    title: 'Business',
    route: null,
    subMenu: [{
      title: 'Be Our Partner',
      route: '/partners',
      type: 'internal'
    }, {
      title: 'Jiphpreneurship',
      route: '/Jiphpreneurship',
      type: 'internal'
    },
    {
      title: 'Partners Guide',
      route: '/guide/partner',
      type: 'internal'
    }, {
      title: 'International Guide',
      route: '/',
      type: 'internal'
    },
    {
      title: 'Partners Agreement',
      route: '/partners-agreement',
      type: 'internal'
    }, {
      title: 'Insurance',
      route: '/insurance',
      type: 'internal'
    }, {
      title: 'Quality Assurance',
      route: '/quality-assurance',
      type: 'internal'
    },]
  },  {
    title: 'Compliance',
    route: null,
    subMenu: [ {
      title: 'Privacy Policy',
      route: '/privacy-policy',
      type: 'internal'
    }, {
      title: 'Terms & Conditions',
      route: '/terms-and-conditions',
      type: 'internal'
    }, {
      title: 'Refund & Cancellation Policy',
      route: '/refund-cancellation-policy',
      type: 'internal'
    },{
      title: 'Anti-Money Laundering Policy',
      route: '/anti-money-laundering-policy',
      type: 'internal'
    }, {
      title: 'PLAID Agreement and Policy',
      route: '/plaid_policy',
      type: 'internal'
    }, {
      title: 'Paynamics Agreement and Policy',
      route: '/paynamics_policy',
      type: 'internal'
    }

    ]
  },{
    title: 'Customer Care',
    route: null,
    subMenu: [{
      title: 'User Guide',
      route: '/guide/user',
      type: 'internal'
    },
    {
      title: 'System Flow',
      route: '/system/flow',
      type: 'internal'
    },
    {
      title: 'Customer Support',
      route: '/customer-support',
      type: 'internal'
    }, {
      title: 'Fraud & Dispute Support',
      route: '/dispute',
      type: 'internal'
    }, {
      title: 'FAQs',
      route: '/faq',
      type: 'internal'
    }]
  },{
    title: 'Community',
    route: null,
    subMenu: [{
      title: 'Stories',
      route: '/stories',
      type: 'internal'
    }, {
      title: 'Facebook',
      route: 'https://www.facebook.com/jiphglobal',
      type: 'external'
    }, {
      title: 'Twitter',
      route: 'https://twitter.com/Jiphglobal',
      type: 'external'
    }, {
      title: 'Instagram',
      route: 'https://www.instagram.com/jiph.global/',
      type: 'external'
    }, {
      title: 'Linkedin',
      route: 'https://www.linkedin.com/company/jiph',
      type: 'external'
    }, {
      title: 'Youtube',
      route: 'https://www.youtube.com/@Jiphglobal',
      type: 'external'
    },]
  },
],
}