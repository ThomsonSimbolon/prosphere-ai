import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service.js';

const analyticsService = new AnalyticsService();

export async function getDashboardData(req: Request, res: Response) {
  try {
    const data = await analyticsService.getDashboardTelemetry();
    return res.status(200).json({
      success: true,
      message: 'Dashboard telemetry retrieved successfully',
      data,
    });
  } catch (error: any) {
    console.error('Error fetching dashboard telemetry:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard telemetry',
      error: error?.message,
    });
  }
}
