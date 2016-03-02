SELECT A06_FFAN_SEARCH_BUSINESS_STAT.DATEKEY,                                                          
       D06_APP_CLIENT.CLIENT_NAME,                                                                     
       sum(A06_FFAN_SEARCH_BUSINESS_STAT.BRAND_SEARCH_BRAND_PV) as BRAND_SEARCH_BRAND_PV,              
       sum(A06_FFAN_SEARCH_BUSINESS_STAT.HOMEPAGE_ENTER_PV) as HOMEPAGE_ENTER_PV,                      
       sum(A06_FFAN_SEARCH_BUSINESS_STAT.PLAZA_DETAIL_SEARCH_PV) as PLAZA_DETAIL_SEARCH_PV,            
       sum(A06_FFAN_SEARCH_BUSINESS_STAT.HOMEPAGE_PLAZA_SELECT_PV) as HOMEPAGE_PLAZA_SELECT_PV,        
       sum(A06_FFAN_SEARCH_BUSINESS_STAT.COUPON_LIST_SEARCH_PV) as COUPON_LIST_SEARCH_PV,              
       sum(A06_FFAN_SEARCH_BUSINESS_STAT.PLAZA_DETAIL_COUPON_LIST_PV) as PLAZA_DETAIL_COUPON_LIST_PV,  
       sum(A06_FFAN_SEARCH_BUSINESS_STAT.FIND_STORE_SEARCH_PV) as FIND_STORE_SEARCH_PV,                
       sum(A06_FFAN_SEARCH_BUSINESS_STAT.PLAZA_DETAIL_FIND_STORE_PV) as PLAZA_DETAIL_FIND_STORE_PV,    
       sum(A06_FFAN_SEARCH_BUSINESS_STAT.HINT_WORD_PV) as HINT_WORD_PV,                                
       sum(A06_FFAN_SEARCH_BUSINESS_STAT.HOT_WORD_PV) as HOT_WORD_PV,                                  
       sum(A06_FFAN_SEARCH_BUSINESS_STAT.HISTORY_RECORD_WORD_PV) as HISTORY_RECORD_WORD_PV,            
       sum(A06_FFAN_SEARCH_BUSINESS_STAT.SEARCH_PAGE_DETAIL_PV) as SEARCH_PAGE_DETAIL_PV,              
       sum(A06_FFAN_SEARCH_BUSINESS_STAT.SEARCH_PAGE_TOTAL_PV) as SEARCH_PAGE_TOTAL_PV                 
  FROM APP.A06_FFAN_SEARCH_BUSINESS_STAT as A06_FFAN_SEARCH_BUSINESS_STAT
  LEFT JOIN FFAN.DIM_DAY as DIM_DAY
ON A06_FFAN_SEARCH_BUSINESS_STAT.DATEKEY = DIM_DAY.DATEKEY
LEFT JOIN DIM.D06_APP_CLIENT as D06_APP_CLIENT
ON A06_FFAN_SEARCH_BUSINESS_STAT.OS_TYPE = D06_APP_CLIENT.ID
where A06_FFAN_SEARCH_BUSINESS_STAT.DATEKEY >='{{start}}' and A06_FFAN_SEARCH_BUSINESS_STAT.DATEKEY <= '{{end}}' {{filters}}
 group by A06_FFAN_SEARCH_BUSINESS_STAT.DATEKEY,
          D06_APP_CLIENT.CLIENT_NAME
order by A06_FFAN_SEARCH_BUSINESS_STAT.DATEKEY   desc