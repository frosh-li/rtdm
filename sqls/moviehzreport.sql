SELECT A06_FFAN_BI_CINEMA_STAT.DATEKEY, 
       SUM(A06_FFAN_BI_CINEMA_STAT.DATA1) AS NEW_USER_CNTS, 
       SUM(A06_FFAN_BI_CINEMA_STAT.DATA2) AS REMAIN_ONE_RATE, 
       SUM(A06_FFAN_BI_CINEMA_STAT.DATA3) AS REMAIN_TWO_RATE, 
       SUM(A06_FFAN_BI_CINEMA_STAT.DATA4) AS REMAIN_THREE_RATE, 
       SUM(A06_FFAN_BI_CINEMA_STAT.DATA5) AS REMAIN_FOUR_RATE, 
       SUM(A06_FFAN_BI_CINEMA_STAT.DATA6) AS REMAIN_FIVE_RATE, 
       SUM(A06_FFAN_BI_CINEMA_STAT.DATA7) AS REMAIN_SIX_RATE, 
       SUM(A06_FFAN_BI_CINEMA_STAT.DATA8) AS REMAIN_SEVEN_RATE, 
       SUM(A06_FFAN_BI_CINEMA_STAT.DATA9) AS REMAIN_FIFTEEN_RATE, 
       SUM(A06_FFAN_BI_CINEMA_STAT.DATA10) AS REMAIN_THIRTY_RATE 
  FROM APP.A06_FFAN_BI_CINEMA_STAT as A06_FFAN_BI_CINEMA_STAT
 WHERE A06_FFAN_BI_CINEMA_STAT.REPORT_ID = 2
  and  A06_FFAN_BI_CINEMA_STAT.DATEKEY>='{{start}}' and A06_FFAN_BI_CINEMA_STAT.DATEKEY<= '{{end}}'
 GROUP BY A06_FFAN_BI_CINEMA_STAT.DATEKEY          
 ORDER BY A06_FFAN_BI_CINEMA_STAT.DATEKEY DESC