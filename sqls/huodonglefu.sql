SELECT
A06_PRODUCT_KPI_FLASH_PAY.DATE_KEY
,D06_APP_CLIENT.CLIENT_NAME
,sum(A06_PRODUCT_KPI_FLASH_PAY.PAY_PV) as PAY_PV
,sum(A06_PRODUCT_KPI_FLASH_PAY.OPT_PV) as OPT_PV
,sum(A06_PRODUCT_KPI_FLASH_PAY.ORD_RATE) as ORD_RATE
,sum(A06_PRODUCT_KPI_FLASH_PAY.ORD_NUM) as ORD_NUM
,sum(A06_PRODUCT_KPI_FLASH_PAY.SUCCESS_ORD_NUM) as SUCCESS_ORD_NUM
,sum(A06_PRODUCT_KPI_FLASH_PAY.SUCCESS_ORD_RATE) as SUCCESS_ORD_RATE
,sum(A06_PRODUCT_KPI_FLASH_PAY.ORIG_AMOUNT) as ORIG_AMOUNT
,sum(A06_PRODUCT_KPI_FLASH_PAY.TRADE_AMOUNT) as TRADE_AMOUNT
,sum(A06_PRODUCT_KPI_FLASH_PAY.REFUND_NUM) as REFUND_NUM
FROM APP.A06_PRODUCT_KPI_FLASH_PAY as A06_PRODUCT_KPI_FLASH_PAY 
INNER JOIN DIM.D06_APP_CLIENT as D06_APP_CLIENT
ON A06_PRODUCT_KPI_FLASH_PAY.OS_TYPE = D06_APP_CLIENT.ID
where DATE_KEY >='{{start}}' and DATE_KEY <= '{{end}}' {{filters}} 
group by A06_PRODUCT_KPI_FLASH_PAY.DATE_KEY
,A06_PRODUCT_KPI_FLASH_PAY.OS_TYPE
,D06_APP_CLIENT.CLIENT_NAME