<template>
  <div id="dot-nav">
    <ul class="dot-navbar">
      <li
        class="menu-item"
        v-for="(sectionTitle, i) in sectionTitles"
        :key="sectionTitle"
        @click="scrollTo"
      >
        <a href="#" :data-scroll-to="getSectionLink(i)">{{sectionTitle}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import tippy from "tippy.js";

function getPadding() {
  return $("#site-navigation").height() + 35;
}

export default {
  props: ["selector"],
  data: function() {
    return { sectionTitles: [] };
  },
  computed: {
    toolTip() {
      return d3Tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(p => {
          return `<div>${p}</div>`;
        });
    }
  },
  methods: {
    wrapSectionTitles() {
      let v = this;

      $(this.selector).each(function(i, el) {
        let t = $(this);
        let text = $(this).text();
        t.attr("id", `section-${i + 1}`);
        v.sectionTitles.push(t.text());
        t.nextUntil(v.selector)
          .andSelf()
          .wrapAll("<section/>");
      });
    },
    getSectionLink(i) {
      return `#section-${i + 1}`;
    },
    scrollTo(e) {
      let element = $(e.target);

      this.$scrollTo(
        element
          .children()
          .first()
          .data("scroll-to"),
        500,
        { offset: -getPadding() }
      );
    },
    // add tooltips
    addTooltips() {
      // add tool tips
      $(".dot-navbar li").each(function() {
        // add the content data attribute
        let text = $(this)
          .find("a")
          .text();
        $(this).attr("data-tippy-content", text);

        // initialize the tooltip
        tippy($(this)[0], {
          delay: 0,
          duration: 0,
          placement: "left",
          theme: "blue",
          arrow: true,
          arrowType: "round",
          size: "large",
          sticky: true
        });
      });
    },
    // highlight the appropriate dots when scrolling
    highlightDots() {
      let currentTop = $(window).scrollTop() + getPadding();
      let elems = $("section");
      elems.each(function(index) {
        let elemTop = $(this).offset().top;
        let elemBottom = elemTop + $(this).height();

        let nav = $("#dot-nav li").eq(index);
        let inbounds = currentTop >= elemTop - 1 && currentTop <= elemBottom;
        let firstElement = index === 0 && currentTop < elemTop;
        if (inbounds || firstElement) {
          nav.addClass("active");
        } else {
          nav.removeClass("active");
        }
      });
    }
  },
  mounted() {
    this.wrapSectionTitles();
    $(window).bind("scroll", e => this.highlightDots());

    this.$nextTick(() => this.addTooltips());
  }
};
</script>

<style>
#dot-nav {
  right: 0px;
  top: 50%;
  margin-top: 0px;
  z-index: 999;
  position: fixed;
  transform: translate(-50%, -50%);
}

#dot-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

#dot-nav li {
  position: relative;
  background-color: rgba(178, 156, 133, 0.25);
  border-radius: 50%;
  cursor: pointer;
  height: 20px;
  margin: 20px;
  width: 20px;
}

#dot-nav li.active {
  background-color: #2176d2;
}

#dot-nav li:hover {
  background-color: rgba(178, 156, 133, 0.8);
}

#dot-nav a {
  outline: 0;
  vertical-align: top;
  position: relative;
  display: none;
}

li:focus {
  outline: none;
}
.tippy-tooltip.blue-theme {
  background-color: #2176d2;
  font-size: 1.5rem;
  padding: 0.3rem 0.6rem;
}
.tippy-tooltip.blue-theme .tippy-roundarrow {
  fill: #2176d2;
}
</style>
