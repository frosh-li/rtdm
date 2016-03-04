select T.DATEKEY,                                                                                      
       T.HOTWORD_NAME,                                                                                
       T.SEARCH_PV                                                                                     
  from (SELECT A06_FFAN_SEARCH_HOTWORD_RANKING.DATEKEY,
               A06_FFAN_SEARCH_HOTWORD_RANKING.HOTWORD_NAME,
               sum(A06_FFAN_SEARCH_HOTWORD_RANKING.SEARCH_PV) as SEARCH_PV
          FROM APP.A06_FFAN_SEARCH_HOTWORD_RANKING as A06_FFAN_SEARCH_HOTWORD_RANKING
          LEFT JOIN FFAN.DIM_DAY as DIM_DAY
            ON A06_FFAN_SEARCH_HOTWORD_RANKING.DATEKEY = DIM_DAY.DATEKEY
where A06_FFAN_SEARCH_HOTWORD_RANKING.DATEKEY >='{{start}}' and A06_FFAN_SEARCH_HOTWORD_RANKING.DATEKEY <= '{{end}}' {{filters}} 
         group by A06_FFAN_SEARCH_HOTWORD_RANKING.DATEKEY,
                  A06_FFAN_SEARCH_HOTWORD_RANKING.HOTWORD_NAME) T
 order by T.DATEKEY desc, T.SEARCH_PV desc