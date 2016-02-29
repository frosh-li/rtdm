SELECT A06_PRODUCT_KPI_MOVIE.DATE_KEY,D06_APP_CLIENT.client_name,sum(A06_PRODUCT_KPI_MOVIE.MOVIE_PAGE),sum(A06_PRODUCT_KPI_MOVIE.DETAIL_PAGE),sum(A06_PRODUCT_KPI_MOVIE.CHOOSETICKET),sum(A06_PRODUCT_KPI_MOVIE.SELECTSEAT),sum(A06_PRODUCT_KPI_MOVIE.ORDER_PAGE),sum(A06_PRODUCT_KPI_MOVIE.ORDER_CNTS),sum(A06_PRODUCT_KPI_MOVIE.TICKET_CNTS),sum(A06_PRODUCT_KPI_MOVIE.PAY_SUCCESS),sum(A06_PRODUCT_KPI_MOVIE.PAY_ORDER_CNTS),sum(A06_PRODUCT_KPI_MOVIE.CHANGE_ORDER_RATE),sum(A06_PRODUCT_KPI_MOVIE.REFUND_ORDER_CNTS) FROM APP.A06_PRODUCT_KPI_MOVIE as A06_PRODUCT_KPI_MOVIE LEFT JOIN FFAN.DIM_DAY as DIM_DAY ON A06_PRODUCT_KPI_MOVIE.DATE_KEY = DIM_DAY.DATEKEY LEFT JOIN DIM.D06_APP_CLIENT as D06_APP_CLIENT ON A06_PRODUCT_KPI_MOVIE.OS_VERSION = D06_APP_CLIENT.ID where DIM_DAY.DATEKEY >='{{start}}' and DIM_DAY.DATEKEY <= '{{end}}' {{filters}} group by  D06_APP_CLIENT.client_name,A06_PRODUCT_KPI_MOVIE.DATE_KEY order by A06_PRODUCT_KPI_MOVIE.DATE_KEY desc