SELECT
A06_PRODUCT_KPI_ACTIVITY.DATE_KEY    
,D06_APP_CLIENT.CLIENT_NAME   
,D06_PLAZA_REGION_INFO.PLAZA_NAME
,sum(A06_PRODUCT_KPI_ACTIVITY.LIST_PV) as LIST_PV   
,sum(A06_PRODUCT_KPI_ACTIVITY.LIST_UV) as LIST_UV  
,SUM(A06_PRODUCT_KPI_ACTIVITY.DETAIL_PV) AS DETAIL_PV   
,SUM(A06_PRODUCT_KPI_ACTIVITY.DETAIL_UV) AS DETAIL_UV  
,sum(A06_PRODUCT_KPI_ACTIVITY.CONFIRM_PV) as CONFIRM_PV  
,sum(A06_PRODUCT_KPI_ACTIVITY.PAYMENT_METHOD_PV) as PAYMENT_METHOD_PV  
,sum(A06_PRODUCT_KPI_ACTIVITY.ORD_NUM) as ORD_NUM  
,sum(A06_PRODUCT_KPI_ACTIVITY.ORD_USERS) as ORD_USERS   
,sum(A06_PRODUCT_KPI_ACTIVITY.ORD_RATE) as ORD_RATE   
,sum(A06_PRODUCT_KPI_ACTIVITY.SUCCESS_ORD_NUM) as SUCCESS_ORD_NUM  
,sum(A06_PRODUCT_KPI_ACTIVITY.SUCCESS_ORD_USERS) as SUCCESS_ORD_USERS   
,sum(A06_PRODUCT_KPI_ACTIVITY.SUCCESS_ORD_RATE) as SUCCESS_ORD_RATE   
,sum(A06_PRODUCT_KPI_ACTIVITY.WRITE_ORD) as WRITE_ORD   
,sum(A06_PRODUCT_KPI_ACTIVITY.WRITE_USERS) as WRITE_USERS   
FROM APP.A06_PRODUCT_KPI_ACTIVITY as A06_PRODUCT_KPI_ACTIVITY 
INNER JOIN DIM.D06_APP_CLIENT as D06_APP_CLIENT
ON A06_PRODUCT_KPI_ACTIVITY.OS_TYPE = D06_APP_CLIENT.ID
INNER JOIN DIM.D06_PLAZA_REGION_INFO as D06_PLAZA_REGION_INFO
ON A06_PRODUCT_KPI_ACTIVITY.PLAZA_ID = D06_PLAZA_REGION_INFO.PLAZA_ID
where A06_PRODUCT_KPI_ACTIVITY.PROMOTION_TYPE=0 

and   A06_PRODUCT_KPI_ACTIVITY.DATE_KEY>='{{start}}' and A06_PRODUCT_KPI_ACTIVITY.DATE_KEY<= '{{end}}' {{filters}}

group by A06_PRODUCT_KPI_ACTIVITY.DATE_KEY    
,D06_APP_CLIENT.CLIENT_NAME   
,D06_PLAZA_REGION_INFO.PLAZA_NAME

order by A06_PRODUCT_KPI_ACTIVITY.DATE_KEY   desc