<template>
  <div>
    <div class="row">
      <div
        v-if="errorMsg"
        class="col-12 alert alert-danger">
        {{ errorMsg }}
      </div>
    </div>

    <div class="row">
      <div class="col-sm-8">
        <input
          placeholder='The title of your post'
          class='forum-title-box'
          :disabled="isSubmitting"
          name="title"
          v-validate="'required'"
          type='text'
          v-model='title' />
      </div>
    </div>

    <div class="row">
      <div
        v-show="errors.has('title')"
        class="col-sm-6 alert alert-danger">
        {{ errors.first('title') }}
      </div>
    </div>

    <div class="row">
      <div class="col-sm-8">
        <textarea placeholder='Your content here..'
          class='forum-content-box'
          :disabled="isSubmitting"
          type='text'
          name="content"
          v-validate="'required'"
          :value="content"
          @input="update" />
      </div>
      <div class="col-sm-2">
        <div v-if="isSubmitting">
          <spinner :show="true"></spinner>
        </div>
        <div v-else>
          <button class='button-submit'
            :disabled="isSubmitting"
            @click='submit'>Submit Post</button>
        </div>
      </div>
    </div>

    <div
      v-show="errors.has('content')"
      class="alert alert-danger">
      {{ errors.first('content') }}
    </div>

    <br>
    <h4>Preview</h4>
    <br>

    <div class="row">
      <div
        class="col-sm-8 md"
        v-html="compiledMarkdown">
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from 'components/Spinner'
import marked from 'marked'
import { debounce } from 'lodash'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'forum-thread-compose',
  components: {
    Spinner
  },
  data () {
    return {
      title: '',
      content: '',
      errorMsg: null,
      isSubmitting: false,
      loading: true
    }
  },

  computed: {
    // local computed methods +
    ...mapState({
      me (state) {
        return state.me
      }
    }),
    compiledMarkdown () {
      return marked(this.content)
    }
  },
  methods: {
    ...mapActions([
      'forumThreadCreate',
      'fetchForumThreads'
    ]),
    update: debounce(function (e) {
      this.content = e.target.value
    }, 200),
    submit () {
      this.errorMsg = null
      return this.$validator.validateAll().then((result) => {
        if (result) {
          this.isSubmitting = true
          this.forumThreadCreate({
            title: this.title,
            content: this.content
          })
            .then((response) => {
              this.content = null
              this.title = null
              this.isSubmitting = false
              // Fetch comments
              this.fetchForumThreads({
              })
            })
            .catch((error) => {
              this.errorMsg = `Sorry were errors submitting :(: ${error.response.data.message}`
              this.isSubmitting = false
              this.$toasted.error(error.response.data.message)
            })
        } else {
          this.errorMsg = 'Sorry there are invalid fields on the form :('
        }
      })
    }
  }
}
</script>


<style scoped lang="stylus">
@import './../css/variables'

.forum-content-box
  width 100%
  padding 20px 10px
  margin-bottom 12px
  border-radius 4px
  border 1px solid #c5c5c5
  min-height 200px

.button-submit
  border 0

.forum-title-box
  width 100%
  padding 10px
  margin-bottom 12px
  border none
  border-bottom 1px solid #ccc

.md
  background-color #eee
  margin 5px
  padding 10px

</style>
