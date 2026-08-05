const weeklyData = [
  { week: "Jun 29", region: "North America", channel: "Organic", signups: 820, paidConversions: 112, churnRisk: 42, activationRate: 68 },
  { week: "Jun 29", region: "Europe", channel: "Paid Search", signups: 610, paidConversions: 91, churnRisk: 39, activationRate: 64 },
  { week: "Jun 29", region: "APAC", channel: "Referral", signups: 430, paidConversions: 58, churnRisk: 31, activationRate: 71 },
  { week: "Jul 06", region: "North America", channel: "Paid Search", signups: 920, paidConversions: 148, churnRisk: 46, activationRate: 66 },
  { week: "Jul 06", region: "Europe", channel: "Organic", signups: 690, paidConversions: 103, churnRisk: 35, activationRate: 69 },
  { week: "Jul 06", region: "APAC", channel: "Referral", signups: 510, paidConversions: 70, churnRisk: 29, activationRate: 73 },
  { week: "Jul 13", region: "North America", channel: "Referral", signups: 980, paidConversions: 167, churnRisk: 41, activationRate: 72 },
  { week: "Jul 13", region: "Europe", channel: "Paid Search", signups: 720, paidConversions: 118, churnRisk: 38, activationRate: 67 },
  { week: "Jul 13", region: "APAC", channel: "Organic", signups: 560, paidConversions: 81, churnRisk: 33, activationRate: 70 },
  { week: "Jul 20", region: "North America", channel: "Organic", signups: 1040, paidConversions: 181, churnRisk: 44, activationRate: 74 },
  { week: "Jul 20", region: "Europe", channel: "Referral", signups: 760, paidConversions: 126, churnRisk: 34, activationRate: 71 },
  { week: "Jul 20", region: "APAC", channel: "Paid Search", signups: 640, paidConversions: 95, churnRisk: 37, activationRate: 68 },
  { week: "Jul 27", region: "North America", channel: "Paid Search", signups: 1110, paidConversions: 203, churnRisk: 47, activationRate: 73 },
  { week: "Jul 27", region: "Europe", channel: "Organic", signups: 840, paidConversions: 141, churnRisk: 32, activationRate: 75 },
  { week: "Jul 27", region: "APAC", channel: "Referral", signups: 690, paidConversions: 104, churnRisk: 30, activationRate: 76 },
  { week: "Aug 03", region: "North America", channel: "Referral", signups: 1190, paidConversions: 224, churnRisk: 43, activationRate: 77 },
  { week: "Aug 03", region: "Europe", channel: "Paid Search", signups: 910, paidConversions: 152, churnRisk: 36, activationRate: 72 },
  { week: "Aug 03", region: "APAC", channel: "Organic", signups: 740, paidConversions: 119, churnRisk: 28, activationRate: 79 },
];

const regionFilter = document.querySelector("#regionFilter");
const channelFilter = document.querySelector("#channelFilter");
const kpis = document.querySelector("#kpis");
const chart = document.querySelector("#chart");
const weeklyTable = document.querySelector("#weeklyTable");

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function getFilteredData() {
  const region = regionFilter.value;
  const channel = channelFilter.value;

  return weeklyData.filter((item) => {
    const matchesRegion = region === "all" || item.region === region;
    const matchesChannel = channel === "all" || item.channel === channel;
    return matchesRegion && matchesChannel;
  });
}

function summarize(data) {
  const totals = data.reduce((summary, item) => ({
    signups: summary.signups + item.signups,
    paidConversions: summary.paidConversions + item.paidConversions,
    churnRisk: summary.churnRisk + item.churnRisk,
    activationRate: summary.activationRate + item.activationRate,
  }), { signups: 0, paidConversions: 0, churnRisk: 0, activationRate: 0 });

  return {
    totalSignups: totals.signups,
    paidConversions: totals.paidConversions,
    churnRisk: data.length ? Math.round(totals.churnRisk / data.length) : 0,
    activationRate: data.length ? Math.round(totals.activationRate / data.length) : 0,
  };
}

function groupByWeek(data) {
  return data.reduce((weeks, item) => {
    weeks[item.week] = (weeks[item.week] || 0) + item.signups;
    return weeks;
  }, {});
}

function renderKpis(summary) {
  const cards = [
    { label: "Total signups", value: formatNumber(summary.totalSignups), helper: "New accounts created" },
    { label: "Paid conversions", value: formatNumber(summary.paidConversions), helper: "Signups upgraded to paid" },
    { label: "Churn risk", value: `${summary.churnRisk}%`, helper: "Average at-risk cohort" },
    { label: "Activation rate", value: `${summary.activationRate}%`, helper: "Completed onboarding" },
  ];

  kpis.innerHTML = cards.map((card) => `
    <article class="kpi-card">
      <p>${card.label}</p>
      <strong>${card.value}</strong>
      <span>${card.helper}</span>
    </article>
  `).join("");
}

function renderChart(data) {
  const weeklySignups = groupByWeek(data);
  const entries = Object.entries(weeklySignups);
  const maxSignups = Math.max(...entries.map(([, value]) => value), 1);

  chart.innerHTML = entries.length ? entries.map(([week, signups]) => `
    <div class="bar-row">
      <span>${week}</span>
      <div class="bar-track">
        <div class="bar" style="width: ${(signups / maxSignups) * 100}%"></div>
      </div>
      <strong>${formatNumber(signups)}</strong>
    </div>
  `).join("") : `<p class="empty">No signup data matches these filters.</p>`;
}

function renderTable(data) {
  weeklyTable.innerHTML = data.length ? data.map((item) => `
    <tr>
      <td>${item.week}</td>
      <td>${item.region}</td>
      <td>${item.channel}</td>
      <td>${formatNumber(item.signups)}</td>
      <td>${formatNumber(item.paidConversions)}</td>
      <td>${item.churnRisk}%</td>
      <td>${item.activationRate}%</td>
    </tr>
  `).join("") : `
    <tr>
      <td colspan="7" class="empty">No weekly data matches these filters.</td>
    </tr>
  `;
}

function render() {
  const visibleData = getFilteredData();
  renderKpis(summarize(visibleData));
  renderChart(visibleData);
  renderTable(visibleData);
}

regionFilter.addEventListener("change", render);
channelFilter.addEventListener("change", render);
render();
