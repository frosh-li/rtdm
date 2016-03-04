SELECT A06_FFAN_SHOPPING_ANALYSIS.DATEKEY,
       SUM(A06_FFAN_SHOPPING_ANALYSIS.DATA1) AS STORE_TOTAL_GOODS_CNTS,      
       SUM(A06_FFAN_SHOPPING_ANALYSIS.DATA2) AS STORE_SHOW_GOODS_CNTS,       
       SUM(A06_FFAN_SHOPPING_ANALYSIS.DATA3) AS STORE_CUR_GOODS_CNTS,       
       SUM(A06_FFAN_SHOPPING_ANALYSIS.DATA4) AS STORE_SHOW_CUR_GOODS_CNTS,   
       SUM(A06_FFAN_SHOPPING_ANALYSIS.DATA5) AS BRAND_TOTAL_GOODS_CNTS,      
       SUM(A06_FFAN_SHOPPING_ANALYSIS.DATA6) AS BRAND_SHOW_GOODS_CNTS,     
       SUM(A06_FFAN_SHOPPING_ANALYSIS.DATA7) AS BRAND_CUR_GOODS_CNTS,      
       SUM(A06_FFAN_SHOPPING_ANALYSIS.DATA8) AS BRAND_SHOW_CUR_GOODS_CNTS,   
       SUM(A06_FFAN_SHOPPING_ANALYSIS.DATA9) AS SPECIAL_TOTAL_CNTS,       
       SUM(A06_FFAN_SHOPPING_ANALYSIS.DATA10) AS SPECIAL_SHOW_CNTS,         
       SUM(A06_FFAN_SHOPPING_ANALYSIS.DATA11) AS SPECIAL_CUR_CNTS,           
       SUM(A06_FFAN_SHOPPING_ANALYSIS.DATA12) AS SPECIAL_SHOW_CUR_CNTS       
  FROM APP.A06_FFAN_SHOPPING_ANALYSIS AS A06_FFAN_SHOPPING_ANALYSIS
 WHERE A06_FFAN_SHOPPING_ANALYSIS.REPORT_ID = 3
   AND A06_FFAN_SHOPPING_ANALYSIS.OS_TYPE = 3
and  A06_FFAN_SHOPPING_ANALYSIS.DATEKEY>='{{start}}' and A06_FFAN_SHOPPING_ANALYSIS.DATEKEY<= '{{end}}' {{filters}}
 GROUP BY A06_FFAN_SHOPPING_ANALYSIS.DATEKEY
 ORDER BY A06_FFAN_SHOPPING_ANALYSIS.DATEKEY DESC