<template>
  <!-- ----------------------------------------------------------------------------- -->
  <!-- Carousel Animation -->
  <!-- ----------------------------------------------------------------------------- -->

  <BaseCard title="Carousel Animation" 
     
    modalid="modal-2"
    modaltitle="Carousel Animation"
    >
    <!-- --------------------------
    code view
    ---------------------------- -->
    <template v-slot:highlight>
    <pre class="mb-0">
        <code class="javascript">
&lt;div&gt;
  &lt;b-carousel
    id=&quot;carousel-fade&quot;
    style=&quot;text-shadow: 0px 0px 2px #000&quot;
    fade
    indicators
    img-width=&quot;1024&quot;
    img-height=&quot;480&quot;
  &gt;
    &lt;b-carousel-slide
      caption=&quot;First slide&quot;
      img-src=&quot;https://picsum.photos/1024/480/?image=10&quot;
    &gt;&lt;/b-carousel-slide&gt;
    &lt;b-carousel-slide
      caption=&quot;Second Slide&quot;
      img-src=&quot;https://picsum.photos/1024/480/?image=12&quot;
    &gt;&lt;/b-carousel-slide&gt;
    &lt;b-carousel-slide
      caption=&quot;Third Slide&quot;
      img-src=&quot;https://picsum.photos/1024/480/?image=22&quot;
    &gt;&lt;/b-carousel-slide&gt;
  &lt;/b-carousel&gt;
&lt;/div&gt;
</code>
</pre>
    </template> 
    <!-- --------------------------
    code view
    ---------------------------- -->

    <template v-slot:comcode>
      <b-carousel
        id="carousel-1"
        v-model="slide"
        :interval="4000"
        controls
        indicators
        fade
        background="#ababab"
        img-width="1024"
        img-height="480"
        style="text-shadow: 1px 1px 2px #333"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
      >
        <!-- Text slides with image -->
        <b-carousel-slide
          caption="First slide"
          text="Nulla vitae elit libero, a pharetra augue mollis interdum."
          img-src="@/assets/images/big/img5.jpg"
        ></b-carousel-slide>

        <!-- Slides with custom text -->
        <b-carousel-slide img-src="@/assets/images/big/img6.jpg">
          <h1>Hello world!</h1>
        </b-carousel-slide>

        <!-- Slides with image only -->
        <b-carousel-slide
          img-src="@/assets/images/big/img7.jpg"
        ></b-carousel-slide>

        <!-- Slides with img slot -->
      </b-carousel>

      <p class="mt-4">
        Slide #: {{ slide }}<br />
        Sliding: {{ sliding }}
      </p>
    </template> 
   
  </BaseCard>
</template>

<script>
import BaseCard from "../../card/BaseCard";
export default {
  name: "CarouselAnimation",

  data() {
    return {
      slide: 0,
      sliding: null,
    };
  },
  methods: {
    onSlideStart() {
      this.sliding = true;
    },
    onSlideEnd() {
      this.sliding = false;
    },
  },
  components: { BaseCard },
};
</script>