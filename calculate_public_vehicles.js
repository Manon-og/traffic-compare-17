// Calculate actual public vehicle improvements from validation data
import validationData from './src/data/realData/validation.ts';

let totalD3QNJeepneys = 0;
let totalD3QNBuses = 0;
let totalFixedJeepneys = 0;
let totalFixedBuses = 0;
let count = 0;

validationData.forEach(episode => {
  if (episode.d3qn && episode.fixed_time) {
    totalD3QNJeepneys += episode.d3qn.jeepneys_processed;
    totalD3QNBuses += episode.d3qn.buses_processed;
    totalFixedJeepneys += episode.fixed_time.jeepneys_processed;
    totalFixedBuses += episode.fixed_time.buses_processed;
    count++;
  }
});

const avgD3QNJeepneys = totalD3QNJeepneys / count;
const avgD3QNBuses = totalD3QNBuses / count;
const avgD3QNPublic = avgD3QNJeepneys + avgD3QNBuses;

const avgFixedJeepneys = totalFixedJeepneys / count;
const avgFixedBuses = totalFixedBuses / count;
const avgFixedPublic = avgFixedJeepneys + avgFixedBuses;

const jeepneyImprovement = ((avgD3QNJeepneys - avgFixedJeepneys) / avgFixedJeepneys) * 100;
const busImprovement = ((avgD3QNBuses - avgFixedBuses) / avgFixedBuses) * 100;
const publicImprovement = ((avgD3QNPublic - avgFixedPublic) / avgFixedPublic) * 100;

console.log('\n🚍 Public Vehicle Throughput Analysis (66 Episodes):');
console.log('═══════════════════════════════════════════════════');
console.log(`\n📊 D3QN Averages:`);
console.log(`   Jeepneys: ${avgD3QNJeepneys.toFixed(2)}`);
console.log(`   Buses: ${avgD3QNBuses.toFixed(2)}`);
console.log(`   Total Public Vehicles: ${avgD3QNPublic.toFixed(2)}`);

console.log(`\n📊 Fixed Time Averages:`);
console.log(`   Jeepneys: ${avgFixedJeepneys.toFixed(2)}`);
console.log(`   Buses: ${avgFixedBuses.toFixed(2)}`);
console.log(`   Total Public Vehicles: ${avgFixedPublic.toFixed(2)}`);

console.log(`\n✅ Improvements:`);
console.log(`   Jeepney Improvement: +${jeepneyImprovement.toFixed(2)}%`);
console.log(`   Bus Improvement: +${busImprovement.toFixed(2)}%`);
console.log(`   Combined Public Vehicle Improvement: +${publicImprovement.toFixed(2)}%`);
console.log('\n═══════════════════════════════════════════════════\n');
