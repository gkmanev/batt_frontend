import Vue from "vue";
import Router from "vue-router";


Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,

  routes: [
    {
      path: "/",
      redirect: "/dashboard/entra",
      component: () => import("@/layouts/full-layout/FullLayout"),
      children: [
        {
          name: "Battery Fleet",
          path: '/dashboard/entra',
          component: () =>
            import(
              "@/views/dashboards/custom-dashboard/CustomDashboard"
            ),
        },
        {
          name: "Asset Dashboard",
          path: '/dashboard/client',
          component: () =>
            import(
              "@/views/dashboards/client-dashboard/ClientDashboard"
            ),
        },
        {
          name: "System",
          path: '/dashboard/system',          
          component: () =>
            import(
              "@/views/dashboards/system-dashboard/SystemDashboard"
            ),
        },
        {
          name: "Starter",
          path: "starter",
          component: () => 
          import("@/views/Starter"),
        },
        {
          name: "Services",
          path: "services",
          component: () => import("@/views/Services"),
        },
        {
          name: "Chat",
          path: "/apps/chat",
          component: () => import("@/views/apps/chats/Chat"),
        },
        {
          name: "TreeView",
          path: "/apps/treeview",
          component: () => import("@/views/apps/treeview/TreeView"),
        },
        {
          name: "Calendar",
          path: "/apps/calendar",
          component: () => import("@/views/apps/calendar/Calendar"),
        },
        {
          name: "Ecommerce",
          path: "/apps/ecommerce",
          component: () => import("@/views/apps/ecommerce/Ecommerce"),
        },
        {
          name: "Email",
          path: "/apps/email/inbox",
          component: () => import("@/views/apps/email/Email"),
          children: [
            {
              path: "/apps/email/:mailType",
              name: "MailIndex",
              component: () => import("@/views/apps/email/EmailList.vue"),
            },
            {
              path: "/apps/email/:mailType/0/:uuid",
              name: "MailDetail1",
              component: () => import(`@/views/apps/email/EmailDetail.vue`),
            },
            {
              path: "/apps/email/0/:mailTag",
              name: "MailTag",
              component: () => import("@/views/apps/email/EmailList.vue"),
            },
            {
              path: "/apps/email/0/:mailTag/0/:uuid",
              name: "MailDetail",
              component: () => import(`@/views/apps/email/EmailDetail.vue`),
            },
          ],
        },
        {
          name: "Contacts",
          path: "/apps/contacts",
          component: () => import("@/views/apps/contact/Contact"),
        },
        {
          name: "Contacts Table",
          path: "/apps/contactslist",
          component: () => import("@/views/apps/contact-table/ContactTable"),
        },
        {
          name: "Alert",
          path: "/ui-elements/alert",
          component: () => import("@/views/ui-elements/Alert"),
        },
        {
          name: "Aspect",
          path: "/ui-elements/aspect",
          component: () => import("@/views/ui-elements/Aspect"),
        },
        {
          name: "Avatar",
          path: "/ui-elements/avatar",
          component: () => import("@/views/ui-elements/Avatar"),
        },
        {
          name: "Badge",
          path: "/ui-elements/badge",
          component: () => import("@/views/ui-elements/Badge"),
        },
        {
          name: "Breadcrumb",
          path: "/ui-elements/breadcrumb",
          component: () => import("@/views/ui-elements/Breadcrumb"),
        },
        {
          name: "Buttons",
          path: "/ui-elements/buttons",
          component: () => import("@/views/ui-elements/Buttons"),
        },
        {
          name: "Button Group",
          path: "/ui-elements/button-group",
          component: () => import("@/views/ui-elements/ButtonGroup"),
        },
        {
          name: "Button Toolbar",
          path: "/ui-elements/button-toolbar",
          component: () => import("@/views/ui-elements/ButtonToolbar"),
        },
        {
          name: "Cards",
          path: "/ui-elements/cards",
          component: () => import("@/views/ui-elements/Cards"),
        },
        {
          name: "Carousel",
          path: "/ui-elements/carousel",
          component: () => import("@/views/ui-elements/Carousel"),
        },
        {
          name: "Collapse",
          path: "/ui-elements/collapse",
          component: () => import("@/views/ui-elements/Collapse"),
        },
        {
          name: "Dropdown",
          path: "/ui-elements/dropdown",
          component: () => import("@/views/ui-elements/Dropdown"),
        },
        {
          name: "Embed",
          path: "/ui-elements/embed",
          component: () => import("@/views/ui-elements/Embed"),
        },
        {
          name: "Image",
          path: "/ui-elements/image",
          component: () => import("@/views/ui-elements/Image"),
        },
        {
          name: "Jumbotron",
          path: "/ui-elements/jumbotron",
          component: () => import("@/views/ui-elements/Jumbotron"),
        },
        {
          name: "Grid",
          path: "/ui-elements/grid",
          component: () => import("@/views/ui-elements/Grid"),
        },
        {
          name: "ListGroup",
          path: "/ui-elements/list-group",
          component: () => import("@/views/ui-elements/ListGroup"),
        },
        {
          name: "Media",
          path: "/ui-elements/media",
          component: () => import("@/views/ui-elements/Media"),
        },
        {
          name: "Modal",
          path: "/ui-elements/modal",
          component: () => import("@/views/ui-elements/Modal"),
        },
        {
          name: "Nav",
          path: "/ui-elements/nav",
          component: () => import("@/views/ui-elements/Nav"),
        },
        {
          name: "Navbar",
          path: "/ui-elements/navbar",
          component: () => import("@/views/ui-elements/Navbar"),
        },
        {
          name: "Overlay",
          path: "/ui-elements/overlay",
          component: () => import("@/views/ui-elements/Overlay"),
        },
        {
          name: "Pagination",
          path: "/ui-elements/pagination",
          component: () => import("@/views/ui-elements/Pagination"),
        },
        {
          name: "Pagination Nav",
          path: "/ui-elements/pagination-nav",
          component: () => import("@/views/ui-elements/PaginationNav"),
        },
        {
          name: "Popover",
          path: "/ui-elements/popover",
          component: () => import("@/views/ui-elements/Popover"),
        },
        {
          name: "Progress",
          path: "/ui-elements/progress",
          component: () => import("@/views/ui-elements/Progress"),
        },
        {
          name: "Sidebar",
          path: "/ui-elements/sidebar",
          component: () => import("@/views/ui-elements/Sidebar"),
        },
        {
          name: "Skeleton",
          path: "/ui-elements/skeleton",
          component: () => import("@/views/ui-elements/Skeleton"),
        },
        {
          name: "Spinner",
          path: "/ui-elements/spinner",
          component: () => import("@/views/ui-elements/Spinner"),
        },
        {
          name: "Tabs",
          path: "/ui-elements/tabs",
          component: () => import("@/views/ui-elements/Tabs"),
        },
        {
          name: "Time",
          path: "/ui-elements/time",
          component: () => import("@/views/ui-elements/Time"),
        },
        {
          name: "Toasts",
          path: "/ui-elements/toasts",
          component: () => import("@/views/ui-elements/Toasts"),
        },
        {
          name: "Tooltip",
          path: "/ui-elements/tooltip",
          component: () => import("@/views/ui-elements/Tooltip"),
        },
        // form  elements
        {
          name: "Checkbox",
          path: "/form-elements/checkbox",
          component: () => import("@/views/form-elements/Checkbox"),
        },
        {
          name: "Switch",
          path: "/form-elements/switch",
          component: () => import("@/views/form-elements/Switch"),
        },
        {
          name: "Radio",
          path: "/form-elements/radio",
          component: () => import("@/views/form-elements/Radio"),
        },
        {
          name: "Datepicker",
          path: "/form-elements/datepicker",
          component: () => import("@/views/form-elements/Datepicker"),
        },
        {
          name: "File",
          path: "/form-elements/file",
          component: () => import("@/views/form-elements/File"),
        },
        {
          name: "Rating",
          path: "/form-elements/rating",
          component: () => import("@/views/form-elements/Rating"),
        },
        {
          name: "Spin Button",
          path: "/form-elements/spin-button",
          component: () => import("@/views/form-elements/SpinButton"),
        },
        {
          name: "Tags",
          path: "/form-elements/tags",
          component: () => import("@/views/form-elements/Tags"),
        },
        {
          name: "Timepicker",
          path: "/form-elements/timepicker",
          component: () => import("@/views/form-elements/Timepicker"),
        },
        {
          name: "Textarea",
          path: "/form-elements/textarea",
          component: () => import("@/views/form-elements/Textarea"),
        },
        {
          name: "Select",
          path: "/form-elements/select",
          component: () => import("@/views/form-elements/Select"),
        },
        {
          name: "Form Inputs",
          path: "/form-elements/form-inputs",
          component: () => import("@/views/form-elements/FormInputs"),
        },
        // form layouts
        {
          name: "Form Group",
          path: "/form-layouts/form-group",
          component: () => import("@/views/form-layouts/FormGroup"),
        },

        {
          name: "Form Basic",
          path: "/form-layouts/form-basic",
          component: () => import("@/views/form-layouts/FormBasic"),
        },
        {
          name: "Form Row Separator",
          path: "/form-layouts/form-row-separator",
          component: () => import("@/views/form-layouts/FormRowSeparator"),
        },
        {
          name: "Form Bordered",
          path: "/form-layouts/form-bordered",
          component: () => import("@/views/form-layouts/FormBordered"),
        },
        {
          name: "Form Horizontal",
          path: "/form-layouts/form-horizontal",
          component: () => import("@/views/form-layouts/FormHorizontal"),
        },
        {
          name: "Form Striped Row",
          path: "/form-layouts/form-striped-row",
          component: () => import("@/views/form-layouts/FormStripedRow"),
        },
        {
          name: "Form Wizard",
          path: "/form-layouts/form-wizard",
          component: () => import("@/views/form-layouts/FormWizard"),
        },

        // tables
        {
          name: "Basic Tables",
          path: "/tables/basic-table",
          component: () => import("@/views/tables/BasicTables"),
        },
        {
          name: "Pagination Table",
          path: "/tables/pagination-table",
          component: () => import("@/views/tables/PaginationTable"),
        },
        {
          name: "Row Select Table",
          path: "/tables/row-select-table",
          component: () => import("@/views/tables/RowSelectTable"),
        },
        {
          name: "Row Details Table",
          path: "/tables/row-detail-table",
          component: () => import("@/views/tables/RowDetailsTable"),
        },
        {
          name: "Sort Table",
          path: "/tables/sort-table",
          component: () => import("@/views/tables/SortTable"),
        },
        {
          name: "Stacked Table",
          path: "/tables/stacked-table",
          component: () => import("@/views/tables/StackedTable"),
        },
        {
          name: "Sticky Header-Column Table",
          path: "/tables/sticky-header-column-table",
          component: () => import("@/views/tables/StickyHeaderColumnTable"),
        },
        {
          name: "Search Table",
          path: "/tables/search-table",
          component: () => import("@/views/tables/SeachTable"),
        },

        // widgets
        {
          name: "Drag n Drop",
          path: "/widgets/drag-n-drop",
          component: () => import("@/views/widgets/drag-n-drop/DragnDrop"),
        },
        {
          name: "Widget Apps",
          path: "/widgets/widget-apps",
          component: () => import("@/views/widgets/widget-apps/WidgetApp"),
        },
        {
          name: "Widget Data",
          path: "/widgets/widget-data",
          component: () => import("@/views/widgets/widget-data/WidgetData"),
        },

        // icons
        {
          name: "Font Awesome",
          path: "/icons/fontawesome",
          component: () => import("@/views/icons/FontAwesomeIcons"),
        },
        {
          name: "Material",
          path: "/icons/material",
          component: () => import("@/views/icons/MaterialIcons"),
        },
        {
          name: "Simple line",
          path: "/icons/simpleline",
          component: () => import("@/views/icons/SimpleLineIcons"),
        },
        {
          name: "Themify",
          path: "/icons/themify",
          component: () => import("@/views/icons/ThemifyIcons"),
        },
        {
          name: "Feather",
          path: "/icons/feather",
          component: () => import("@/views/icons/FeatherIcons"),
        },
        // charts
        {
          name: "Apex Charts",
          path: "/charts/apexcharts",
          component: () => import("@/views/charts/apexcharts/ApexCharts"),
        },

        // dashboard
        {
          name: "Modern Dashboard",
          path: "/dashboard/modern-dashboard",
          component: () =>
            import("@/views/dashboards/modern-dashboard/ModernDashboard"),
        },
        {
          name: "Awesome Dashboard",
          path: "/dashboard/awesome-dashboard",
          component: () =>
            import("@/views/dashboards/awesome-dashboard/AwesomeDashboard"),
        },
        {
          name: "Classy Dashboard",
          path: "/dashboard/classy-dashboard",
          component: () =>
            import("@/views/dashboards/classy-dashboard/ClassyDashboard"),
        },
        {
          name: "Minimal Dashboard",
          path: "/dashboard/minimal-dashboard",
          component: () =>
            import("@/views/dashboards/minimal-dashboard/MinimalDashboard"),
        },
        {
          name: "Analytical Dashboard",
          path: "/dashboard/analytical-dashboard",
          component: () =>
            import(
              "@/views/dashboards/analytical-dashboard/AnalyticalDashboard"
            ),
        },
      ],
    },
    {
      path: "/authentication",
      component: () => import("@/layouts/blank-layout/Blanklayout"),
      children: [
        {
          name: "BoxedLogin",
          path: "boxedlogin",
          redirect: "/dashboard/entra",
        },
        {
          name: "FullLogin",
          path: "fulllogin",
          redirect: "/dashboard/entra",
        },
        {
          name: "BoxedRegister",
          path: "boxedregister",
          component: () => import("@/views/authentication/BoxedRegister"),
        },
        {
          name: "FullRegister",
          path: "fullregister",
          component: () => import("@/views/authentication/FullRegister"),
        },
        {
          name: "Error",
          path: "error",
          component: () => import("@/views/authentication/Error"),
        },
      ],
    },
    {
      path: "*",
      component: () => import("@/views/authentication/Error"),
    },
  ],
});

import NProgress from "nprogress";

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    // Start the route progress bar.
    NProgress.start(800);
  }
  next();
});

router.afterEach(() => {
  // Complete the animation of the route progress bar.
  NProgress.done();
});

export default router;
