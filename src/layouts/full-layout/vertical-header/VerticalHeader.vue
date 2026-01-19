<template>
  <header class="topbar">
    <b-navbar
      toggleable="lg"
      :type="`${navbarColor == 'white' ? 'light' : 'dark'}`"
      class="p-0"
      :variant="navbarColor"
    >
      <b-navbar-nav
        ><b-nav-item @click="showMobileSidebar" class="d-block d-lg-none"
          ><i class="mdi mdi-menu fs-3"></i></b-nav-item
      ></b-navbar-nav>
      <div :class="`navbar-header d-block d-lg-none`">
        <LogoDark v-if="navbarColor == 'white'" />
        <LogoLight v-else />
      </div>
      <b-navbar-toggle target="nav-collapse" class="mx-2 border-0"
        ><i class="ti-more"></i
      ></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav class="">
        <!-- -----------------------------------------------------------
          Left aligned nav items
        ----------------------------------------------------------- -->
        <b-navbar-nav>
          <!-- -----------------------------------------------------------
            Toggle Sidebar
          ----------------------------------------------------------- -->
          <b-nav-item @click="setMiniSidebar" class="d-none d-lg-block"
            ><feather type="arrow-left-circle"></feather
          ></b-nav-item>

          <!-- -----------------------------------------------------------
            Notification Dropdown
          ----------------------------------------------------------- -->
          <!-- <b-nav-item-dropdown left no-caret class="mailbox">
         
            <template #button-content>
              <feather type="message-square"></feather>
              <div class="notify">
                <span class="heartbit"></span> <span class="point"></span>
              </div>
            </template>
            <b-dropdown-text class="border-bottom rounded-top py-2 px-1">
              <div>
                <h5 class="mb-0 fw-medium">Notifications</h5>
              </div>
            </b-dropdown-text>
            <VuePerfectScrollbar class="scrlbar" style="height: 250px">
              <b-dropdown-item
                v-for="(item, i) in notifications"
                :key="i"
                @click="href"
                class="border-bottom"
              >
                <div class="d-flex align-items-center">
                  <b-avatar :variant="item.btnbg" class="rounded-circle">
                    <feather :type="item.btnicon" class="feather-sm"></feather>
                  </b-avatar>
                  <div class="ml-3 w-75">
                    <h6 class="fw-medium mb-0">{{ item.title }}</h6>
                    <span
                      class="text-truncate d-block text-muted font-weight-light"
                      >{{ item.subtext }}</span
                    >
                    <small class="text-muted">{{ item.time }}</small>
                  </div>
                </div>
              </b-dropdown-item>
            </VuePerfectScrollbar>
            <b-dropdown-text>
              <b-link
                href="#"
                class="link d-flex align-items-center justify-content-center text-decoration-none fw-medium text-dark"
              >
                Check all Notifications
                <feather type="chevron-right" class="feather-sm"></feather>
              </b-link>
            </b-dropdown-text>
          </b-nav-item-dropdown> -->

          <!-- -----------------------------------------------------------
            Message Dropdown
          ----------------------------------------------------------- -->
          <!-- <b-nav-item-dropdown left no-caret class="mailbox">
            <template #button-content>
              <feather type="inbox"></feather>
              <div class="notify">
                <span class="heartbit"></span> <span class="point"></span>
              </div>
            </template>
            <b-dropdown-text class="border-bottom rounded-top py-2 px-1">
              <div>
                <h5 class="mb-0 fw-medium">Messages</h5>
              </div>
            </b-dropdown-text>
            <VuePerfectScrollbar class="scrlbar" style="height: 250px">
              <b-dropdown-item
                v-for="(item, i) in messages"
                :key="i"
                @click="href"
                class="border-bottom"
              >
                <div class="d-flex align-items-center">
                  <b-avatar
                    :src="item.btnbg"
                    variant="none"
                    class="rounded-circle"
                    badge
                    :badge-variant="item.badgebg"
                  >
                  </b-avatar>
                  <div class="ml-3 w-75">
                    <h6 class="fw-medium mb-0">{{ item.title }}</h6>
                    <span
                      class="text-truncate d-block text-muted font-weight-light"
                      >{{ item.subtext }}</span
                    >
                    <small class="text-muted">{{ item.time }}</small>
                  </div>
                </div>
              </b-dropdown-item>
            </VuePerfectScrollbar>
            <b-dropdown-text>
              <b-link
                href="#"
                class="link d-flex align-items-center justify-content-center text-decoration-none fw-medium text-dark"
              >
                Check all Messages
                <feather type="chevron-right" class="feather-sm"></feather>
              </b-link>
            </b-dropdown-text>
          </b-nav-item-dropdown> -->

          <!-- -----------------------------------------------------------
            Mega Dropdown
          ----------------------------------------------------------- -->
          <!-- <b-nav-item-dropdown left no-caret class="two-column-dd">
            <template #button-content>
              <feather type="grid"></feather>
            </template>
            <b-row class="no-gutters">
              <b-col cols="6" class="border-right">
                <b-dropdown-item class="text-center" to="/apps/chat">
                  <feather
                    type="message-circle"
                    class="mt-3 text-info"
                  ></feather>
                  <h5 class="card-title mb-0 mt-2">Chats</h5>
                  <p class="text-muted pb-2 font-weight-light">
                    Connect with the world
                  </p>
                </b-dropdown-item>
              </b-col>
              <b-col cols="6">
                <b-dropdown-item class="text-center" to="/apps/email/inbox">
                  <feather type="mail" class="mt-3 text-info"></feather>
                  <h5 class="card-title mb-0 mt-2">Email</h5>
                  <p class="text-muted pb-2">Compose new email</p>
                </b-dropdown-item>
              </b-col>
              <b-col cols="6" class="border-right border-top">
                <b-dropdown-item class="text-center" to="/apps/contactslist">
                  <feather type="phone" class="mt-3 text-info"></feather>
                  <h5 class="card-title mb-0 mt-2">Contact List</h5>
                  <p class="text-muted pb-2">Add new contact</p>
                </b-dropdown-item>
              </b-col>
              <b-col cols="6" class="border-top">
                <b-dropdown-item class="text-center" to="/apps/ecommerce">
                  <feather
                    type="shopping-cart"
                    class="mt-3 text-info"
                  ></feather>
                  <h5 class="card-title mb-0 mt-2">Ecommerce</h5>
                  <p class="text-muted pb-2">Buy a new product</p>
                </b-dropdown-item>
              </b-col>
            </b-row>
          </b-nav-item-dropdown> -->

          <!-- Logout -->
          <b-button variant="danger" @click="logout" size="sm" class="mr-2">
            Logout
          </b-button>
        </b-navbar-nav>

        <!-- -----------------------------------------------------------
          Right aligned nav items
        ----------------------------------------------------------- -->
        <b-navbar-nav class="ml-auto">
          <!-- -----------------------------------------------------------
            Language Dropdown
          ----------------------------------------------------------- -->
          <!-- <b-nav-item-dropdown right no-caret>
            <template #button-content>
              <i :class="getCurrentLanguage.lang"></i>
            </template>
            <b-dropdown-item @click="changeLanguage('en')"
              ><i class="mr-2 flag-icon flag-icon-us"></i>
              English</b-dropdown-item
            >
            <b-dropdown-item @click="changeLanguage('fr')"
              ><i class="mr-2 flag-icon flag-icon-fr"></i>
              French</b-dropdown-item
            >
            <b-dropdown-item @click="changeLanguage('ch')"
              ><i class="mr-2 flag-icon flag-icon-ch"></i>
              Chinese</b-dropdown-item
            >
            <b-dropdown-item @click="changeLanguage('gr')"
              ><i class="mr-2 flag-icon flag-icon-gr"></i>
              German</b-dropdown-item
            >
          </b-nav-item-dropdown> -->

          <!-- -----------------------------------------------------------
            Profile Dropdown
          ----------------------------------------------------------- -->
          <!-- <b-nav-item-dropdown right no-caret class="mailbox">
           
            <template #button-content>
              <img
                src="../../../assets/images/users/1.jpg"
                alt="user"
                class="rounded-circle"
                width="31"
              />
            </template>
            <b-dropdown-text class="bg-primary text-white">
              <div class="d-flex align-items-center py-2">
                <b-img
                  src="@/assets/images/users/1.jpg"
                  width="50"
                  rounded="circle"
                />
                <div class="ml-3">
                  <h4 class="mb-0 text-white">Steave Jobs</h4>
                  <span class="font-weight-light">varun@gmail.com</span>
                </div>
              </div>
            </b-dropdown-text>
            <b-dropdown-item href="#" class="d-flex align-items-center">
              <feather type="user" class="feather-sm mr-2 mb-n1"></feather>
              Profile
            </b-dropdown-item>
            <b-dropdown-item href="#" class="d-flex align-items-center">
              <feather type="mail" class="feather-sm mr-2 mb-n1"></feather>
              Inbox
            </b-dropdown-item>
            <b-dropdown-item href="#" class="d-flex align-items-center">
              <feather
                type="message-circle"
                class="feather-sm mr-2 mb-n1"
              ></feather>
              Chat
            </b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item href="#" class="d-flex align-items-center">
              <feather type="settings" class="feather-sm mr-2 mb-n1"></feather>
              Settings
            </b-dropdown-item>
            <b-dropdown-item href="#" class="d-flex align-items-center">
              <feather type="log-out" class="feather-sm mr-2 mb-n1"></feather>
              Sign out
            </b-dropdown-item>
          </b-nav-item-dropdown> -->
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </header>
</template>

<script>
import { mapState } from "vuex";
import LogoDark from "../logo-dark/LogoDark";
import LogoLight from "../logo-light/LogoLight";
//import VuePerfectScrollbar from "vue-perfect-scrollbar";

import img1 from "../../../assets/images/users/1.jpg";
import img2 from "../../../assets/images/users/2.jpg";
import img3 from "../../../assets/images/users/3.jpg";
import img4 from "../../../assets/images/users/4.jpg";

export default {
  name: "vertical-header",
  data: () => ({
    showToggle: false,
    notifications: [
      {
        btnbg: "danger",
        btnicon: "user",
        title: "Launch Admin",
        subtext: "Just see the my new admin!",
        time: "9:30AM",
      },
      {
        btnbg: "success",
        btnicon: "calendar",
        title: "Event today",
        subtext: "Just a reminder that you have event",
        time: "1:30PM",
      },
      {
        btnbg: "primary",
        btnicon: "settings",
        title: "Settings",
        subtext: "You can customize this template as you want",
        time: "9:30AM",
      },
      {
        btnbg: "info",
        btnicon: "bell",
        title: "New Message",
        subtext: "Sent you an notification",
        time: "1:30PM",
      },
    ],
    messages: [
      {
        btnbg: img1,
        badgebg: "danger",
        title: "Launch Admin",
        subtext: "Just see the my new admin!",
        time: "9:30AM",
      },
      {
        btnbg: img2,
        badgebg: "success",
        title: "Event today",
        subtext: "Just a reminder that you have event",
        time: "1:30PM",
      },
      {
        btnbg: img3,
        badgebg: "primary",
        title: "Settings",
        subtext: "You can customize this template as you want",
        time: "9:30AM",
      },
      {
        btnbg: img4,
        badgebg: "warning",
        title: "New Message",
        subtext: "Sent you an notification",
        time: "1:30PM",
      },
    ],
    href() {
      return undefined;
    },
  }),
  components: {
    LogoDark,
    LogoLight,
    //VuePerfectScrollbar,
  },
  computed: {
    ...mapState(["navbarColor", "logoColor", "LayoutType"]),
    getCurrentLanguage() {
      const locale = this.$i18n.locale;
      if (locale == "en") return { lang: "flag-icon flag-icon-us" };
      else if (locale == "fr") return { lang: "flag-icon flag-icon-fr" };
      else if (locale == "ch") return { lang: "flag-icon flag-icon-ch" };
      else if (locale == "gr") return { lang: "flag-icon flag-icon-gr" };
      return this.locale;
    },
  },
  methods: {
    logout() {
      this.$router.push('/dashboard/entra');
    },
    showMobileSidebar() {
      this.$store.commit("SET_SIDEBAR_DRAWER", true);
    },
    setMiniSidebar() {
      if (this.LayoutType == "full-sidebar") {
        this.$store.dispatch("setLayoutType", "mini-sidebar");
      } else if (this.LayoutType == "mini-sidebar") {
        this.$store.dispatch("setLayoutType", "full-sidebar");
      }
    },
    changeLanguage(locale) {
      this.$i18n.locale = locale;
    },
  },
};
</script>
