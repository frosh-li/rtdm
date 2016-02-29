SELECT
A06_PRODUCT_KPI_FIND_STORE.DATE_KEY
,D06_APP_CLIENT.client_name
,sum(A06_PRODUCT_KPI_FIND_STORE.CLICK_PV)
,sum(A06_PRODUCT_KPI_FIND_STORE.CLICK_UV)
,sum(A06_PRODUCT_KPI_FIND_STORE.CATEGORY_PV)
,sum(A06_PRODUCT_KPI_FIND_STORE.CATEGORY_UV)
,sum(A06_PRODUCT_KPI_FIND_STORE.NAVIGATION_FACILITY_PV)
,sum(A06_PRODUCT_KPI_FIND_STORE.NAVIGATION_FACILITY_UV)
,sum(A06_PRODUCT_KPI_FIND_STORE.ITEM_CLICK_PV)
,sum(A06_PRODUCT_KPI_FIND_STORE.ITEM_CLICK_UV)
,sum(A06_PRODUCT_KPI_FIND_STORE.GOWHERE_PV)
,sum(A06_PRODUCT_KPI_FIND_STORE.GOWHERE_UV)
,sum(A06_PRODUCT_KPI_FIND_STORE.ALPHABETICAL_PV)
,sum(A06_PRODUCT_KPI_FIND_STORE.ALPHABETICAL_UV)
FROM APP.A06_PRODUCT_KPI_FIND_STORE as A06_PRODUCT_KPI_FIND_STORE
LEFT JOIN DIM.D06_APP_CLIENT as D06_APP_CLIENT
ON A06_PRODUCT_KPI_FIND_STORE.OS_VERSION = D06_APP_CLIENT.ID
where A06_PRODUCT_KPI_FIND_STORE.DATE_KEY >='{{start}}' and A06_PRODUCT_KPI_FIND_STORE.DATE_KEY<= '{{end}}' {{filters}} 
group by A06_PRODUCT_KPI_FIND_STORE.DATE_KEY,D06_APP_CLIENT.client_name
order by A06_PRODUCT_KPI_FIND_STORE.DATE_KEY desc