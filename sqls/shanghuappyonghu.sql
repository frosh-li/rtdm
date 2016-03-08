SELECT
A06_MERCHANT_APP_USER_USE_BUSS_KPI_STAT.DT
,SUM(A06_MERCHANT_APP_USER_USE_BUSS_KPI_STAT.NUM_NEW)              
,SUM(A06_MERCHANT_APP_USER_USE_BUSS_KPI_STAT.NUM_HIS)              
,SUM(A06_MERCHANT_APP_USER_USE_BUSS_KPI_STAT.MANAGER_NEW)          
,SUM(A06_MERCHANT_APP_USER_USE_BUSS_KPI_STAT.MANAGER_HIS)          
,SUM(A06_MERCHANT_APP_USER_USE_BUSS_KPI_STAT.STAFF_NEW)            
,SUM(A06_MERCHANT_APP_USER_USE_BUSS_KPI_STAT.STAFF_HIS)            
FROM APP.A06_MERCHANT_APP_USER_USE_BUSS_KPI_STAT as A06_MERCHANT_APP_USER_USE_BUSS_KPI_STAT 
where A06_MERCHANT_APP_USER_USE_BUSS_KPI_STAT.DT>='{{start}}' and A06_MERCHANT_APP_USER_USE_BUSS_KPI_STAT.DT<= '{{end}}' {{filters}}

GROUP BY A06_MERCHANT_APP_USER_USE_BUSS_KPI_STAT.DT
ORDER BY A06_MERCHANT_APP_USER_USE_BUSS_KPI_STAT.DT DESC