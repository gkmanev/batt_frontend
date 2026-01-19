<template>
  <b-card class="mb-4">
    <div class="mt-4">
      <v-chart
        class="chart"
        height="250"
        :option="option"
        :loading="loading"
        autoresize
      />
    </div>
  </b-card>
</template>

<script>
import VChart from "vue-echarts";
import axios from "axios";
import { mapState } from "vuex";
import { use } from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
  DataZoomComponent,
  MarkLineComponent
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
  DataZoomComponent,
  MarkLineComponent,
  LineChart,
  CanvasRenderer
]);

/** ---------- Utils (local-time) ---------- */
function pad(n) {
  return ("0" + n).slice(-2);
}

function fmtLocal_HHMM(value, timeZone) {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    ...(timeZone ? { timeZone } : {})
  });
}

function fmtLocal_DDMM_HHMM_TZ(value, timeZone) {
  return new Date(value).toLocaleString([], {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
    ...(timeZone ? { timeZone } : {})
  });
}

export default {
  name: "PriceChart",
  components: { VChart },

  data() {
    return {
      loading: false,
      cancelSource: null,

      // Force a specific zone if you want; leave null to use the browser's
      // Set to 'Europe/Sofia' to lock to Bulgaria time regardless of user device
      forceTimeZone: "Europe/Sofia",

      // Local-time anchors (ms since epoch) for chart windows + Now line
      dayStartMs: 0,
      nowMs: 0,
      tomorrowMs: 0,

      // UTC ISO strings for the API (derived from local anchors)
      dayStartIso: "",
      nowIso: "",
      tomorrowIso: "",

      // Data buckets
      dataPast: [], // for "today" left side
      dataFuture: [], // for "today" right side
      dataAny: [], // for month/year

      option: {} // built in watchers
    };
  },

  computed: {
    ...mapState(["dateRange"])
  },

  watch: {
    // Build immediately and on changes
    dateRange: {
      immediate: true,
      handler() {
        this.resetData();
        this.syncClockAnchors();
        this.fetchData();
      }
    }
  },

  mounted() {
    // safety if store not ready
    if (!this.dayStartMs) this.syncClockAnchors();
  },

  methods: {
    /** ---------- Time Anchors (use local time, hour-aligned "now") ---------- */
    syncClockAnchors() {
      const tz = this.forceTimeZone || undefined;

      // Current local time (respecting forced TZ if set)
      const now = tz
        ? new Date(new Date().toLocaleString("en-US", { timeZone: tz }))
        : new Date();

      // Local midnight
      const dayStartLocal = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0
      );

      // Local top-of-hour "now"
      const nowHourLocal = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        0,
        0,
        0
      );

      const tomorrowStartLocal = new Date(
        dayStartLocal.getTime() + 24 * 3600 * 1000
      );

      // For chart (local timeline)
      this.dayStartMs = dayStartLocal.getTime();
      this.nowMs = nowHourLocal.getTime();
      this.tomorrowMs = tomorrowStartLocal.getTime();

      // For API (UTC Z)
      this.dayStartIso = dayStartLocal.toISOString();
      this.nowIso = nowHourLocal.toISOString();
      this.tomorrowIso = tomorrowStartLocal.toISOString();

      // Initialize option skeleton
      this.option = this.buildBaseOption();
    },

    /** ---------- Data lifecycle ---------- */
    resetData() {
      this.dataPast = [];
      this.dataFuture = [];
      this.dataAny = [];
      this.option = this.buildBaseOption();
    },

    cancelPending() {
      if (this.cancelSource) {
        this.cancelSource.cancel("New request started");
        this.cancelSource = null;
      }
    },

    async fetchData() {
      this.cancelPending();
      this.loading = true;
      this.cancelSource = axios.CancelToken.source();

      try {
        if (this.dateRange === "today") {
          const urlPast = `http://85.14.6.37:16601/api/prices/range/?country=BG&contract=A01&start=${this.dayStartIso}&end=${this.nowIso}`;
          const urlFuture = `http://85.14.6.37:16601/api/prices/range/?country=BG&contract=A01&start=${this.nowIso}&end=${this.tomorrowIso}`;

          const [r1, r2] = await Promise.all([
            axios.get(urlPast, { cancelToken: this.cancelSource.token }),
            axios.get(urlFuture, { cancelToken: this.cancelSource.token })
          ]);

          this.dataPast = (r1.data?.items || []).map(el => [
            el.datetime_utc,
            el.price
          ]);
          this.dataFuture = (r2.data?.items || []).map(el => [
            el.datetime_utc,
            el.price
          ]);

          this.option = this.buildTodayOption();
        } else {
          const url = `http://85.14.6.37:16455/api/price/?date_range=${this.dateRange}`;
          const r = await axios.get(url, {
            cancelToken: this.cancelSource.token
          });

          this.dataAny = (r.data || []).map(el => [el.timestamp, el.value]);

          this.option = this.buildRangeOption();
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Fetch error:", err);
          const base = this.buildBaseOption();
          this.option = {
            ...base,
            title: { ...base.title, text: "DAM Price (failed to load)" }
          };
        }
      } finally {
        this.loading = false;
        this.cancelSource = null;
      }
    },

    /** ---------- Option builders ---------- */
    buildBaseOption() {
      const tz = this.forceTimeZone || undefined;

      return {
        title: {
          text: "DAM Price",
          left: "center",
          textStyle: {
            fontSize: 16,
            color: "#b2b9bf",
            fontFamily: "Arial",
            fontWeight: "normal"
          }
        },
        grid: { bottom: "18%", containLabel: true },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "line", snap: true },
          borderWidth: 0,
          backgroundColor: "rgba(0,0,0,0.8)",
          textStyle: { color: "#fff" },
          formatter: params => {
            if (!params?.length) return "";
            const time = fmtLocal_DDMM_HHMM_TZ(params[0].value[0], tz);
            const items = params
              .map(p => {
                const val = (Array.isArray(p.value) ? p.value[1] : p.value) ?? "-";
                return `
                <li style="list-style:none;margin:0;padding:2px 0;">
                  <span style="display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:6px;background:${p.color};"></span>
                  <span style="opacity:.7;">${p.seriesName}:</span>
                  <span style="margin-left:6px;">${val}</span>
                </li>`;
              })
              .join("");
            return `
              <div style="padding:6px 8px;">
                <div style="margin-bottom:6px;opacity:.8;">${time}</div>
                <ul style="margin:0;padding:0;">${items}</ul>
              </div>`;
          }
        },
        xAxis: {
          type: "time",
          boundaryGap: false,
          axisLabel: {
            rotate: 40,
            margin: 16,
            color: "#9a9a9a",
            formatter: value => fmtLocal_HHMM(value, tz)
          },
          axisLine: { show: true }
        },
        yAxis: {
          type: "value",
          splitLine: { show: false }
          // name: "BGN/MWh", // uncomment if you want units on axis
          // nameGap: 22
        },
        dataZoom: [
          { type: "inside", start: 0, end: 100 },
          {
            height: 20,
            show: true,
            handleSize: "75%",
            dataBackground: { areaStyle: { color: "#9a9a9a" } },
            start: 0,
            end: 100
          }
        ],
        legend: { show: false },
        toolbox: {
          right: 10,
          feature: {
            saveAsImage: { title: "Save" },
            restore: { title: "Reset" },
            dataZoom: { title: { zoom: "Zoom", back: "Reset Zoom" } }
          }
        },
        series: []
      };
    },

    buildTodayOption() {
      const base = this.buildBaseOption();

      // Local-day window
      base.xAxis.min = this.dayStartMs;
      base.xAxis.max = this.tomorrowMs - 1;
      base.xAxis.splitNumber = 24;

      base.series = [
        {
          name: "Price (past)",
          type: "line",
          data: this.dataPast,
          smooth: true,
          step: "middle",
          clip: true,
          sampling: "lttb",
          showSymbol: false,
          lineStyle: { width: 1.5 },
          itemStyle: { color: "#39c449" },
          progressive: 2000
        },
        {
          name: "Price (future)",
          type: "line",
          data: this.dataFuture,
          smooth: false,
          step: "middle",
          showSymbol: false,
          sampling: "lttb",
          lineStyle: { type: "dashed", width: 1.2 },
          itemStyle: { color: "#39c449" },
          progressive: 2000
        },
        {
          // Vertical "Now" line (local)
          type: "line",
          name: "Now",
          data: [],
          markLine: {
            symbol: "none",
            silent: true,
            label: {
              show: true,
              formatter: "Now",
              position: "end", // 'start' or 'middle' also work
              color: "#fff", // text color
              fontSize: 12,
              fontWeight: "bold",
              backgroundColor: "#39c449", // match the green line
              padding: [4, 8],
              borderRadius: 6,
              shadowColor: "rgba(0,0,0,0.3)",
              shadowBlur: 3
            },
            lineStyle: {
              width: 1.5,
              type: "solid",
              color: "#39c449",
              opacity: 0.8
            },
            data: [{ xAxis: this.nowMs }]
          }
        }
      ];

      return base;
    },

    buildRangeOption() {
      const base = this.buildBaseOption();
      const tz = this.forceTimeZone || undefined;

      if (this.dateRange === "month") {
        // Local first to last day of this month
        const now = tz
          ? new Date(new Date().toLocaleString("en-US", { timeZone: tz }))
          : new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        const end = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );

        base.xAxis.min = start.getTime();
        base.xAxis.max = end.getTime();
        base.xAxis.splitNumber = 30;
        base.xAxis.axisLabel.formatter = value => {
          const d = tz
            ? new Date(new Date(value).toLocaleString("en-US", { timeZone: tz }))
            : new Date(value);
          return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}`;
        };
      } else if (this.dateRange === "year") {
        // Local Jan 1 -> Dec 31
        const now = tz
          ? new Date(new Date().toLocaleString("en-US", { timeZone: tz }))
          : new Date();
        const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        const end = new Date(
          now.getFullYear(),
          11,
          31,
          23,
          59,
          59,
          999
        );

        base.xAxis.min = start.getTime();
        base.xAxis.max = end.getTime();
        base.xAxis.splitNumber = 12;
        base.xAxis.axisLabel.formatter = value => {
          const d = tz
            ? new Date(new Date(value).toLocaleString("en-US", { timeZone: tz }))
            : new Date(value);
          return `${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
        };
      }

      base.series = [
        {
          name: "Price",
          type: "line",
          data: this.dataAny,
          smooth: true,
          step: "middle",
          clip: true,
          sampling: "lttb",
          showSymbol: false,
          lineStyle: { width: 1.5 },
          itemStyle: { color: "#39c449" },
          progressive: 4000
        }
      ];
      return base;
    }
  }
};
</script>

<style scoped>
.chart {
  height: 450px;
}
</style>
