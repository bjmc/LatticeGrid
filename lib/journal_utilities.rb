
def CurrentJournals()
  journals = Abstract.all.collect{|a| a.journal_abbreviation.downcase}.sort.uniq
end

def AllJournalsWithImpact()
  journals = Journal.all.collect{|a| a.journal_abbreviation.downcase}.sort.uniq
end

def CurrentJournalsWithImpactScore(journal_list)
  journals_w_scores = Journal.journals_with_scores(journal_list)
end

def CreateJournalImpactFromHash(data_row)
  # assumed header values
  #Abbreviated Journal Title
  #ISSN
  #{2008} Total Cites
  #Impact Factor
  #5-Year Impact Factor
  #Immediacy Index
  #{2008} Articles
  #Cited Half-Life
  #Eigenfactor Score
  #Article Influence Score
	
  # get smarter to pull out impact factor year. Right now it is encoded in the ISI file in the heading Total_Cites as '{year} Total Cites'
  j = Journal.new
  j.score_year = 2008
  j.journal_abbreviation =  data_row['Abbreviated Journal Title']
  j.issn = data_row['ISSN']
  j.total_cites = data_row["{#{j.score_year}} Total Cites"]
  j.impact_factor = data_row['Impact Factor']
  j.impact_factor_five_year = data_row['5-Year Impact Factor']
  j.immediacy_index = data_row['Immediacy Index']
  j.total_articles = data_row["{#{j.score_year}} Articles"]
  j.eigenfactor_score = data_row['Eigenfactor Score']
  j.article_influence_score = data_row['Article Influence Score']

  existing_j = Journal.find_by_journal_abbreviation(j.journal_abbreviation)
  if existing_j.blank? && ! j.journal_abbreviation.blank? then
    j.save!
   end
end
