export let sidebarRoutes =
    [
        {
            sectionName: "Basics",
            routes: [
                {
                    title: 'Dashboard',
                    icon: "mingcute:grid-fill",
                    link: '/portal/dashboard',
                    permissions: ['View_Dashboard'],
                    miniTitle: "Dashboard"
                },
                {
                    title: "Payments",
                    icon: "fa6-solid:money-check",
                    miniTitle: "Payments",

                    links: [
                        {
                            title: "View Payments",
                            link: '/portal/payments/viewpayments',
                            permissions: ["View_Payment"]
                        },
                        {
                            title: "Make Payment",
                            link: '/portal/payments/makepayment',
                            permissions: ["Manage_Payment"]
                        },
                        {
                            title: "Payment Confirmation",
                            link: '/portal/payments/paymentconfirmation',
                            permissions: ["Manage_Payment", "View_Payment"]
                        },
                    ],
                },
                {
                    title: "Customer Care Center",
                    miniTitle: "Cust. C.C",
                    icon: "streamline:information-desk-customer-solid",
                    links: [
                        {
                            title: "Call Subscibers",
                            link: '/portal/customercare/callsubscribers',
                            permissions: ["View_Subscriptions"]
                        }
                    ]
                },
                {
                    title: "Auto-Debit OPS",
                    icon: "mdi:credit-card-check",
                    miniTitle: "Auto D.opt",
                    links: [
                        {
                            title: "Check Mandate Details",
                            link: '/portal/autodebitoperation/checkmandate',
                            permissions: ["View_Debit_OPS", "Manage_Debit_OPS"]
                        },
                        {
                            title: "Unmandated Subscribers",
                            link: '/portal/autodebitoperation/unmandatedsubscribers',
                            permissions: ["View_Debit_OPS", "Manage_Debit_OPS"]

                        }
                    ]
                },
                {
                    title: "Staff & User Onboarding",
                    miniTitle: "Onboarding",
                    icon: "ooui:user-group-rtl",
                    links: [
                        {
                            title: "Staff Onboarding",
                            link: '/portal/staffsandusers/staffonboarding',
                            permissions: ["View_Users", "Manage_Users"]
                        },
                        {
                            title: "User Onboarding",
                            link: '/portal/staffsandusers/useronboarding',
                            permissions: ["View_Users", "Manage_Users"]
                        },
                        {
                            title: "Reset Password",
                            link: '/portal/myaccount',
                            permissions: ["View_Dashboard"]
                        },
                        {
                            title: "User Roles & Permissions",
                            link: '/portal/staffsandusers/user-roles-and-permission',
                            permissions: ["View_Users", "Manage_Users"]
                        },
                    ],
                }

            ]
        },
        {
            sectionName: "SUBSCRIPTION",
            routes: [
                // {
                //     title: "Individual Subscription",
                //     icon: "bi:person-fill-check",
                //     link: "/not found"
                // },
                {
                    title: "Individual And Group",
                    icon: "fa:users",
                    link: "/portal/individual-group-subscription",
                    permissions: ["View_Subscriptions", "Manage_Subscriptions"],
                    miniTitle: "Ind.& Grps."

                },
                {
                    title: "Family Subscription",
                    miniTitle: "Family",
                    icon: "material-symbols:family-restroom",
                    links: [
                        {
                            title: 'Family Subscibers',
                            link: '/portal/familysubscription/familysubscribers',
                            permissions: ["View_Subscriptions", "Manage_Subscriptions"]

                        },
                        {
                            title: 'Family Plan Members',
                            link: '/portal/familysubscription/familyplanmembers',
                            permissions: ["View_Subscriptions", "Manage_Subscriptions"]
                        },
                        {
                            title: 'View Family Subs',
                            link: '/portal/familysubscription/viewfamilysubscription',
                            permissions: ["View_Subscriptions", "Manage_Subscriptions"]
                        },
                    ]
                },
                {
                    title: "Corporate Subscription",
                    miniTitle: "Corporate",
                    icon: "ic:round-corporate-fare",
                    links: [
                        {
                            title: 'Corporate Subscribers',
                            link: '/portal/corporatesubscription/corporatesubscribers',
                            permissions: ["View_Subscriptions", "Manage_Subscriptions"]
                        },
                        {
                            title: 'View Corporate Subs',
                            link: '/portal/corporatesubscription/viewcorporatesubscription',
                            permissions: ["View_Subscriptions", "Manage_Subscriptions"]
                        },
                    ]
                },
                {
                    title: "Data Migration",
                    miniTitle: "Migration",
                    icon: "ep:upload-filled",
                    links: [
                        {
                            title: 'Import Data',
                            link: '/portal/datamigration/importdata',
                            permissions: ["View_Settings"]
                        },
                        {
                            title: 'Complete Migrate Subs',
                            link: '/portal/datamigration/completemigratedsubs',
                            permissions: ["View_Settings"]
                        }
                    ]
                },
            ]

        },

        {
            sectionName: "Reporting",
            routes: [
                {
                    title: "Subscribers View",
                    miniTitle: "Subs View",
                    icon: "icon-park-solid:book",
                    link: "/portal/subscribers",
                    permissions: ["View_Subscriptions", "Manage_Subscriptions"]
                },
                {
                    title: "Facility Performance",
                    miniTitle: "Fac. View",
                    icon: "icon-park-solid:book",
                    link: "/portal/facilitiesperformance",
                    permissions: ["View_Subscriptions", "Manage_Subscriptions"]
                },
                {
                    title: "Staff Collection Perf.",
                    miniTitle: "Staff View",
                    icon: "icon-park-solid:book",
                    link: "/portal/staffperformance",
                    permissions: ["View_Subscriptions", "Manage_Subscriptions"]
                },
                {
                    title: "Agents Commision List",
                    miniTitle: "Agents Comm.",
                    icon: "icon-park-solid:book",
                    link: "/portal/agentscommission",
                    permissions: ["View_Subscriptions", "Manage_Subscriptions"]
                },
            ]
        },
        {
            sectionName: "SETUPS",
            routes: [
                {
                    title: 'Facility Setup',
                    miniTitle: "Facility",
                    icon: "mdi:gear",
                    link: "/portal/facility",
                    permissions: ["View_Settings"]
                },
                {
                    title: 'Package Setup',
                    miniTitle: "Package",
                    icon: "mdi:gear",
                    link: "/portal/package",
                    permissions: ["View_Settings"]
                },
                {
                    title: 'Bank Setup',
                    miniTitle: "Bank",
                    icon: "mdi:gear",
                    link: "/portal/bank",
                    permissions: ["View_Settings"]
                },
                {
                    title: 'Call Comment Category',
                    miniTitle: "Call C.C",
                    icon: "mdi:gear",
                    link: "/portal/callcommentcategory",
                    permissions: ["View_Settings"]
                },
                {
                    title: 'Groups and Associations',
                    miniTitle: "Grps & Ass.",
                    icon: "mdi:gear",
                    link: "/portal/groupsandassociations",
                    permissions: ["View_Settings"]
                },
            ]
        }

    ]