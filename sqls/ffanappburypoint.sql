SELECT
A06_FFAN_APP_EVENT_ID_STATISTICS.DATEKEY
,A06_FFAN_APP_EVENT_ID_STATISTICS.TYPE
,A06_FFAN_APP_EVENT_ID_STATISTICS.APP_TYPE
,A06_FFAN_APP_EVENT_ID_STATISTICS.APP_VERSION
,A06_FFAN_APP_EVENT_ID_STATISTICS.EVENT_ID
,A06_FFAN_APP_EVENT_ID_STATISTICS.EVENT_PAGE
,A06_FFAN_APP_EVENT_ID_STATISTICS.PAGE_BUTTON
,A06_FFAN_APP_EVENT_ID_STATISTICS.TITLE
,SUM(A06_FFAN_APP_EVENT_ID_STATISTICS.PV)
,SUM(A06_FFAN_APP_EVENT_ID_STATISTICS.UV)
FROM APP.A06_FFAN_APP_EVENT_ID_STATISTICS as A06_FFAN_APP_EVENT_ID_STATISTICS 
LEFT JOIN DIM.DIM_DAY as DIM_DAY
ON A06_FFAN_APP_EVENT_ID_STATISTICS.DATEKEY = DIM_DAY.DATEKEY
WHERE A06_FFAN_APP_EVENT_ID_STATISTICS.DATEKEY >='{{start}}' and A06_FFAN_APP_EVENT_ID_STATISTICS.DATEKEY <= '{{end}}' {{filters}}
GROUP BY
A06_FFAN_APP_EVENT_ID_STATISTICS.DATEKEY
,A06_FFAN_APP_EVENT_ID_STATISTICS.TYPE
,A06_FFAN_APP_EVENT_ID_STATISTICS.APP_TYPE
,A06_FFAN_APP_EVENT_ID_STATISTICS.APP_VERSION
,A06_FFAN_APP_EVENT_ID_STATISTICS.EVENT_ID
,A06_FFAN_APP_EVENT_ID_STATISTICS.EVENT_PAGE
,A06_FFAN_APP_EVENT_ID_STATISTICS.PAGE_BUTTON
,A06_FFAN_APP_EVENT_ID_STATISTICS.TITLE
ORDER BY 
A06_FFAN_APP_EVENT_ID_STATISTICS.DATEKEY desc