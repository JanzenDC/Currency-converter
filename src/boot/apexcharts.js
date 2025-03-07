import { boot } from "quasar";
import VueApexCharts from "vue3-apexcharts";

export default boot(({ app }) => {
  app.component("ApexChartComponent", VueApexCharts);
});
