SELECT
A06_FFAN_APP_PERFORMANCE_KPI_STAT.DT
,A06_FFAN_APP_PERFORMANCE_KPI_STAT.APP_TYPE
,SUM(A06_FFAN_APP_PERFORMANCE_KPI_STAT.OPEN_PV)       
,SUM(A06_FFAN_APP_PERFORMANCE_KPI_STAT.STAYTIME)       
,SUM(A06_FFAN_APP_PERFORMANCE_KPI_STAT.CRASH_RATIO)*100
,SUM(A06_FFAN_APP_PERFORMANCE_KPI_STAT.OPENTIME)       
FROM APP.A06_FFAN_APP_PERFORMANCE_KPI_STAT as A06_FFAN_APP_PERFORMANCE_KPI_STAT 

where A06_FFAN_APP_PERFORMANCE_KPI_STAT.DT>='{{start}}' and A06_FFAN_APP_PERFORMANCE_KPI_STAT.DT<= '{{end}}' {{filters}}
GROUP BY A06_FFAN_APP_PERFORMANCE_KPI_STAT.DT,A06_FFAN_APP_PERFORMANCE_KPI_STAT.APP_TYPE
ORDER BY A06_FFAN_APP_PERFORMANCE_KPI_STAT.DT,A06_FFAN_APP_PERFORMANCE_KPI_STAT.APP_TYPE