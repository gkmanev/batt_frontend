<template>
  <div id="login" style="min-height: calc(100vh - 20px)" tag="section">
    <b-row class="justify-content-center no-gutters">
      <b-col lg="12" class="d-flex align-items-center">
        <b-card no-body class="w-100">
          <b-row class="no-gutters" style="min-height: 100vh">
            <b-col
              lg="6"
              class="bg-primary d-md-flex align-items-center justify-content-center"
            >
              <div class="d-flex align-items-center">
                <div class="p-5">
                  <b-row class="justify-content-center">
                    <b-col cols="12" lg="12" xl="12">
                      <div>
                        <h2 class="display-6 text-white">
                          Fleet Managment System
                        </h2>
                        <!-- <p class="mt-4 text-white op-5 font-weight-normal">
                          Wrappixel helps developers to build organized and
                          well-coded admin dashboards full of beautiful and
                          feature rich modules.
                        </p>
                        <b-button
                          size="lg"
                          variant="info"
                          class="mt-4 text-capitalize"
                          >Learn More</b-button
                        > -->
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </b-col>
            <b-col
              lg="6"
              class="d-md-flex align-items-center justify-content-center"
            >
              <div class="d-flex align-items-center w-100">
                <div class="p-5 w-100">
                  <b-row class="justify-content-center">
                    <b-col cols="12" lg="9" xl="6">
                      <!-- <img src="@/assets/images/logo-icon.png" /> -->
                      <h2 class="font-weight-bold mt-4">Sign in</h2>
                      <h6 class="mb-4">
                        Don't have an account?
                        <b-link to="/authentication/fullregister" class
                          >Sign Up</b-link
                        >
                      </h6>

                      <!-- Display error message if login fails -->
                      <b-alert variant="danger" v-if="error" dismissible>{{ error }}</b-alert>

                      <b-form @submit.prevent="login">
                        <b-form-group>
                          <b-form-input
                            id="txt-username"
                            type="text"
                            placeholder="Enter Username"
                            class="mb-3"
                            v-model="$v.form.username.$model"
                            :state="validateState('username')"
                          ></b-form-input>
                          <b-form-invalid-feedback id="txt-username"
                            >This is a required field</b-form-invalid-feedback
                          >
                        </b-form-group>
                        <b-form-group>
                          <b-form-input
                            id="txt-pwd"
                            type="password"
                            placeholder="Enter Password"
                            class="mb-3"
                            v-model="$v.form.pwd.$model"
                            :state="validateState('pwd')"
                          ></b-form-input>
                          <b-form-invalid-feedback id="txt-pwd"
                            >This is a required field</b-form-invalid-feedback
                          >
                        </b-form-group>

                        <div class="d-flex align-items-center">


                          <div class="ml-auto">
                            <a href="javascript:void(0)" class="link"
                              >Forgot pwd?</a
                            >
                          </div>
                        </div>
                        <b-button
                          type="submit"
                          variant="primary"
                          :disabled="$v.form.$invalid"
                          size="lg"
                          block
                          class="mt-4"
                          >Sign In</b-button
                        >
                      </b-form>

                      <div
                        class="d-flex align-items-center justify-content-center mt-4"
                      >
           
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import axios from "axios";

export default {
  name: "FullLogin",
  mixins: [validationMixin],
  data: () => ({
    form: {
      username: "",
      pwd: "",
    },
    checkbox: false,
    error: null, // Error message for failed login
  }),
  validations: {
    form: {
      username: {
        required,
        minLength: minLength(4),
      },
      pwd: {
        required,
        minLength: minLength(8),
      },
    },
  },
  methods: {
    validateState(username) {
      const { $dirty, $error } = this.$v.form[username];
      return $dirty ? !$error : null;
    },

    async login() {
      try {
        await axios.post(
          "http://85.14.6.37:16543/api/token/",
          {
            username: this.form.username,            
            password: this.form.pwd,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        
        // Redirect to the dashboard after login
        this.$router.push({ name: "Battery Fleet" });
      } catch (error) {
        console.error("Login error:", error.response);
        if (error.response && error.response.status === 401) {
          this.error = "Invalid username or password";
        } else {
          this.error = "An error occurred during login. Please try again later.";
        }
      }
    },
  },
};
</script>
