import { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import StatCard from '../components/charts/StatCard';
import BarChartCard from '../components/charts/BarChartCard';
import LineChartCard from '../components/charts/LineChartCard';
import { fetchAnalyticsSummary } from '../services/analyticsService';
import './Analytics.css';

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchAnalyticsSummary()
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Could not load analytics.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p className="page-subtitle">How your task habit is trending.</p>
        </div>
      </div>

      {error ? <div className="form-error-banner">{error}</div> : null}

      {isLoading || !summary ? (
        <p className="dashboard-loading">Crunching your numbers…</p>
      ) : (
        <>
          <div className="stat-grid">
            <StatCard label="Current streak" value={`${summary.currentStreak}d`} accent="amber" hint="Consecutive active days" />
            <StatCard label="Best streak" value={`${summary.bestStreak}d`} accent="amber" hint="Your personal record" />
            <StatCard label="Total tasks" value={summary.totalTasks} accent="neutral" />
            <StatCard label="Completed" value={summary.completedTasks} accent="teal" />
            <StatCard label="Remaining" value={summary.remainingTasks} accent="blue" />
          </div>

          <div className="chart-grid">
            <LineChartCard
              title="Last 24 hours"
              subtitle="Tasks completed, in 3-hour windows"
              data={summary.last24h}
              color="var(--teal)"
            />
            <BarChartCard
              title="This week"
              subtitle="Tasks completed per day"
              data={summary.weekly}
              color="var(--accent)"
            />
            <BarChartCard
              title="Last 6 weeks"
              subtitle="Tasks completed per week"
              data={summary.monthly}
              color="var(--blue)"
            />
            <p id='watermark3'>Developed by kaali</p>
          </div>
        </>
      )}
    </AppLayout>
  );
}
