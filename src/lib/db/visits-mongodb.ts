import connectDB from './mongodb';
import Visit from './models/Visit';

export interface RecordVisitData {
  path: string;
  visitorId: string;
  referrer?: string;
  device?: string;
  country?: string;
}

export const recordVisit = async (data: RecordVisitData) => {
  try {
    await connectDB();
    const visit = new Visit({
      path: data.path,
      visitorId: data.visitorId,
      referrer: data.referrer,
      device: data.device || 'desktop',
      country: data.country,
    });
    await visit.save();
    return visit;
  } catch (error) {
    console.error('Error recording visit:', error);
    // Don't throw so site tracking never crashes the application
    return null;
  }
};

export const getVisitStats = async () => {
  try {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalViews, todayViews, distinctTotalVisitors, distinctTodayVisitors, topPages] =
      await Promise.all([
        Visit.countDocuments(),
        Visit.countDocuments({ createdAt: { $gte: today } }),
        Visit.distinct('visitorId'),
        Visit.distinct('visitorId', { createdAt: { $gte: today } }),
        Visit.aggregate([
          { $group: { _id: '$path', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ]),
      ]);

    // 7 days trend
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [dailyViewsAggregate, dailyVisitorsAggregate] = await Promise.all([
      Visit.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
      ]),
      Visit.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              visitorId: '$visitorId',
            },
          },
        },
        {
          $group: {
            _id: '$_id.date',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const viewsMap: Record<string, number> = {};
    dailyViewsAggregate.forEach((item: any) => {
      viewsMap[item._id] = item.count;
    });

    const visitorsMap: Record<string, number> = {};
    dailyVisitorsAggregate.forEach((item: any) => {
      visitorsMap[item._id] = item.count;
    });

    const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const dailyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Hoje' : dayLabels[d.getDay()];
      dailyTrend.push({
        date: iso,
        label: `${d.getDate()}/${d.getMonth() + 1}`,
        dayName,
        views: viewsMap[iso] || 0,
        visitors: visitorsMap[iso] || 0,
      });
    }

    return {
      totalViews,
      totalVisitors: distinctTotalVisitors.length,
      todayViews,
      todayVisitors: distinctTodayVisitors.length,
      topPages: topPages.map((p: any) => ({ path: p._id, views: p.count })),
      dailyTrend,
    };
  } catch (error) {
    console.error('Error getting visit stats:', error);
    return {
      totalViews: 0,
      totalVisitors: 0,
      todayViews: 0,
      todayVisitors: 0,
      topPages: [],
      dailyTrend: [],
    };
  }
};
