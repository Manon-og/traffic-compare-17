# Traffic Dashboard - Baseline vs RL Comparison

An interactive web-based dashboard for comparing traffic intersection performance between baseline control systems and reinforcement learning algorithms.

## Features

- **Interactive KPI Cards**: Average queue length, throughput, occupancy, and RL rewards
- **Time Series Charts**: Compare performance over cycles with smoothing options
- **Lane Breakdown**: Detailed per-lane analysis with cycle selection
- **CSV Upload/Download**: Load your own data or export filtered results
- **Responsive Filters**: Filter by run, intersection, cycle range, and data completeness
- **Non-technical UI**: Clean, accessible interface for faculty and traffic officers

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will open at `http://localhost:8080`

## Data Schema

The dashboard expects CSV files with these **required columns** (case-sensitive):

| Column | Type | Description |
|--------|------|-------------|
| `run_id` | string | e.g., "baseline_01", "rl_01" |
| `intersection_id` | string | e.g., "Int1", "Int2", "Int3" |
| `cycle_id` | integer | Cycle number |
| `start_time` | string | HH:MM:SS or ISO timestamp |
| `lane_id` | string | Lane or movement identifier |
| `total_count` | integer | Total vehicles in lane for cycle |
| `total_pcu` | float | PCU-equivalent for lane & cycle |
| `occupancy` | float | Occupancy proxy (0-1) |
| `total_queue` | integer | Total queue at cycle end |
| `throughput_pcu` | float | PCU throughput for intersection |

**Optional columns**: `reward`, `phase_index`, `timestamp_step`

## Using the Dashboard

### 1. Load Data
- Click "Load Sample Data" to see example traffic data
- Or click "Upload CSV" to load your own data file

### 2. Filter & Compare
- **Run Comparison**: Select which run_ids to compare (baseline vs RL)
- **Intersection**: Choose specific intersection or view all
- **Cycle Range**: Adjust time window with slider
- **Hide Incomplete**: Filter out rows with missing data

### 3. Analyze Results
- **KPI Cards**: View key metrics with comparison deltas
- **Time Series**: Click points to see lane breakdown for specific cycles
- **Lane Charts**: Understand per-lane performance differences
- **Data Table**: Inspect raw filtered data

### 4. Export Results
- Click "Download Filtered CSV" to save current view
- Perfect for further analysis or reporting

## Example CSV Format

```csv
run_id,intersection_id,cycle_id,start_time,lane_id,total_count,total_pcu,occupancy,total_queue,throughput_pcu,reward
baseline_01,Int1,1,08:00:00,Lane_N,18,14.4,0.72,9,216,
baseline_01,Int1,1,08:00:00,Lane_S,15,12.0,0.65,7,216,
rl_01,Int1,1,08:00:00,Lane_N,16,12.8,0.58,5,234,0.84
rl_01,Int1,1,08:00:00,Lane_S,14,11.2,0.52,4,234,0.84
```

## Technical Architecture

### Key Components
- **TrafficFilters**: Sidebar controls and data loading
- **KPICard**: Metric display with comparison deltas
- **TrafficChart**: Interactive time series and bar charts
- **trafficUtils**: Data processing and validation

### File Structure
```
src/
├── components/traffic/     # Dashboard components
├── data/sampleData.ts     # Sample traffic data
├── utils/trafficUtils.ts  # Data processing utilities
└── pages/Index.tsx        # Main dashboard page
```

### Design System
- Traffic-themed colors (baseline: green, RL: blue)
- Responsive layout with Tailwind CSS
- Accessible components with proper ARIA labels
- Professional styling suitable for presentations

## Extending the Dashboard

### Adding New Metrics
1. Update `TrafficData` interface in `sampleData.ts`
2. Add computation logic in `trafficUtils.ts`
3. Create new KPI card or chart component
4. Update filters if needed

### Custom Visualizations
- Charts use Recharts library for easy customization
- All styling follows the design system in `index.css`
- Components are modular and reusable

### API Integration
The codebase is structured to easily add API data sources:
- Update `trafficUtils.parseCSVData` for JSON endpoints
- Add polling logic in main component
- Maintain same data validation patterns

## Troubleshooting

### CSV Upload Issues
- Ensure all required columns are present (case-sensitive)
- Check for proper numeric formatting
- Verify no extra commas or special characters

### Performance
- Dashboard handles ~100k rows efficiently
- Use cycle range filtering for large datasets
- Consider data pagination for very large files

### Browser Compatibility
- Requires modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Uses ES6+ features and modern CSS

## Contributing

When extending the dashboard:
1. Follow existing code patterns and naming conventions
2. Update data types in TypeScript interfaces
3. Add proper error handling and user feedback
4. Test with various data sizes and edge cases
5. Maintain responsive design principles

## Support

For technical issues or feature requests, refer to the codebase documentation or contact the development team.