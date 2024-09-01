import { ChartOptions } from './help-desk.model';

/**
 * Stat Counder Data
 */
 const statData = [{
    title: 'TICKETS',
    value: 825,
    icon: 'briefcase',

    
    persantage: '5.02',
    profit: 'down',
    month: 'Tickets this month',
    progressBar: [
      { id: 1, bgColor: "bg-success", width: '20%' ,data:'New'},
      { id: 2, bgColor: "bg-info", width: '80%',data:'Completed' },
      // { id: 3, width: 20 },
  ],
  subItem: [
    {
        id: 1,
        icon: "mdi mdi-numeric-1-circle",
        bgColor: "bg-success",
        iconClass: "success",
        label: "New",
        Value:6
    },
    {
        id: 2,
        icon: "mdi mdi-numeric-3-circle",
        bgColor: "bg-info",
         iconClass: "info",
        label: "Completed",
        Value:33
    },
    
],
  },
   {
    title: 'SERVICE ORDERS',
    value: 7522,
    icon: 'award',
    persantage: '3.58',
    profit: 'up',
    month: 'Service Orders this month',
    progressBar: [
      { id: 1, bgColor: "bg-success", width: '100%' },
      // { id: 3, width: 70 },
  ],
  subItem: [
    {
      id: 1,
      icon: "mdi mdi-numeric-1-circle",
      bgColor: "bg-success",
      iconClass: "success",
      label: "Unassigned",
      Value:5
  },],
  },


  {
    title: 'INCIDENTS',
    value: 168.40,
    icon: 'clock',
    persantage: '10.35 ',
    profit: 'down',
    month: 'Incidents this month',
    progressBar: [
      { id: 1, bgColor: "bg-warning", width: '70%' },
      { id: 2, bgColor: "bg-success", width: '30%' },
   
  ],
  subItem: [
    {
      id: 1,
      icon: "mdi mdi-numeric-1-circle",
      bgColor: "bg-warning",
      iconClass: "success",
      label: "Pending",
      Value:11
  },
  {
    id: 1,
    icon: "mdi mdi-numeric-1-circle",
    bgColor: "bg-success",
    iconClass: "success",
    label: "Resolved",
    Value:6
},
],
  },
  
];

/**
 * Active Projects
 */
 const ActiveProjects = [
  {
    Pname: "Brand Logo Design",
    profile: 'assets/images/users/avatar-1.jpg',
    Uname: 'Donald Risher',
    progress: 53,
    assignee: [
        {
          profile: 'assets/images/users/avatar-1.jpg'
        },
        {
          profile: 'assets/images/users/avatar-2.jpg'
        },
        {
          profile: 'assets/images/users/avatar-3.jpg'
        },
      ],
    status: 'Inprogress',
    date: '06 Sep 2021'
  },
  {
    Pname: "Redesign - Landing Page",
    profile: 'assets/images/users/avatar-2.jpg',
    Uname: 'Prezy William',
    progress: 0,
    assignee: [
        {
          profile: 'assets/images/users/avatar-5.jpg'
        },
        {
          profile: 'assets/images/users/avatar-6.jpg'
        }
      ],
    status: 'Pending',
    date: '13 Nov 2021'
  },
  {
    Pname: "Multipurpose Landing Template",
    profile: 'assets/images/users/avatar-3.jpg',
    Uname: 'Boonie Hoynas',
    progress: 100,
    assignee: [
        {
          profile: 'assets/images/users/avatar-7.jpg'
        },
        {
          profile: 'assets/images/users/avatar-8.jpg'
        }
      ],
    status: 'Completed',
    date: '26 Nov 2021'
  },
  {
    Pname: "Chat Application",
    profile: 'assets/images/users/avatar-5.jpg',
    Uname: 'Pauline Moll',
    progress: 64,
    assignee: [
        {
          profile: 'assets/images/users/avatar-2.jpg'
        }
      ],
    status: 'Progress',
    date: '15 Dec 2021'
  },
  {
    Pname: "Create Wireframe",
    profile: 'assets/images/users/avatar-6.jpg',
    Uname: 'James Bangs',
    progress: 77,
    assignee: [
        {
          profile: 'assets/images/users/avatar-1.jpg'
        },
        {
          profile: 'assets/images/users/avatar-6.jpg'
        },
        {
          profile: 'assets/images/users/avatar-4.jpg'
        }
      ],
    status: 'Progress',
    date: '21 Dec 2021'
  }
];

/**
 * My Task
 */
 const MyTask = [
  {
    name: "Create new Admin Template",
    dedline: '03 Nov 2021',
    status: 'Completed',
    assignee: 
    {
      name: 'Mary Stoner',
      profile: 'assets/images/users/avatar-2.jpg'
    }
  },
  {
    name: "Marketing Coordinator",
    dedline: '17 Nov 2021',
    status: 'Progress',
    assignee: 
    {
      name: 'Den Davis',
      profile: 'assets/images/users/avatar-7.jpg'
    }
  },
  {
    name: "Administrative Analyst",
    dedline: '26 Nov 2021',
    status: 'Completed',
    assignee: 
    {
      name: 'Alex Brown',
      profile: 'assets/images/users/avatar-6.jpg'
    }
  },
  {
    name: "E-commerce Landing Page",
    dedline: '10 Dec 2021',
    status: 'Pending',
    assignee: 
    {
      name: 'Prezy Morin',
      profile: 'assets/images/users/avatar-5.jpg'
    }
  },
  {
    name: "UI/UX Design",
    dedline: '22 Dec 2021',
    status: 'Progress',
    assignee: 
    {
      name: 'Stine Nielsen',
      profile: 'assets/images/users/avatar-1.jpg'
    }
  },
  {
    name: "Projects Design",
    dedline: '31 Dec 2021',
    status: 'Pending',
    assignee: 
    {
      name: 'Jansh William',
      profile: 'assets/images/users/avatar-4.jpg'
    }
  }
  
];

/**
 * Team Members
 */
 const TeamMembers = [
  {
    name: "Create new Admin Template",
    dedline: '03 Nov 2021',
    status: 'Completed',
    assignee: 
    {
      name: 'Mary Stoner',
      profile: 'assets/images/users/avatar-2.jpg'
    }
  },
  {
    name: "Marketing Coordinator",
    dedline: '17 Nov 2021',
    status: 'Progress',
    assignee: 
    {
      name: 'Den Davis',
      profile: 'assets/images/users/avatar-7.jpg'
    }
  },
  {
    name: "Administrative Analyst",
    dedline: '26 Nov 2021',
    status: 'Completed',
    assignee: 
    {
      name: 'Alex Brown',
      profile: 'assets/images/users/avatar-6.jpg'
    }
  },
  {
    name: "E-commerce Landing Page",
    dedline: '10 Dec 2021',
    status: 'Pending',
    assignee: 
    {
      name: 'Prezy Morin',
      profile: 'assets/images/users/avatar-5.jpg'
    }
  },
  {
    name: "UI/UX Design",
    dedline: '22 Dec 2021',
    status: 'Progress',
    assignee: 
    {
      name: 'Stine Nielsen',
      profile: 'assets/images/users/avatar-1.jpg'
    }
  },
  {
    name: "Projects Design",
    dedline: '31 Dec 2021',
    status: 'Pending',
    assignee: 
    {
      name: 'Jansh William',
      profile: 'assets/images/users/avatar-4.jpg'
    }
  }
];

export { statData, ActiveProjects, MyTask, TeamMembers };