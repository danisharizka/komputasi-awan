export default {
  async fetch(request, env, ctx) {

    const data = [
      {Country:"USA",Club:"ACM",Goals:31,Shots:159,value:3500000},
      {Country:"Spain",Club:"ATL",Goals:16,Shots:79,value:28000000},
      {Country:"Spain",Club:"RMA",Goals:21,Shots:124,value:32000000},
      {Country:"Spain",Club:"ALA",Goals:11,Shots:87,value:5000000},
      {Country:"Spain",Club:"SEV",Goals:10,Shots:47,value:3000000}
    ];

    const totalPlayers = data.length;

    const totalGoals = data.reduce((sum,d)=> sum + d.Goals,0);
    const avgGoals = totalGoals / totalPlayers;

    const totalShots = data.reduce((sum,d)=> sum + d.Shots,0);
    const avgShots = totalShots / totalPlayers;

    const totalMarketValue = data.reduce((sum,d)=> sum + d.value,0);

    const countryCount = {};
    data.forEach(d=>{
      countryCount[d.Country] = (countryCount[d.Country] || 0) + 1;
    });

    const topCountry = Object.keys(countryCount)
      .reduce((a,b)=> countryCount[a] > countryCount[b] ? a : b);

    const clubGoals = {};
    data.forEach(d=>{
      clubGoals[d.Club] = (clubGoals[d.Club] || 0) + d.Goals;
    });

    const topClub = Object.keys(clubGoals)
      .reduce((a,b)=> clubGoals[a] > clubGoals[b] ? a : b);

    const result = {
      total_players: totalPlayers,
      total_goals: totalGoals,
      avg_goals: avgGoals,
      total_shots: totalShots,
      avg_shots: avgShots,
      top_country: topCountry,
      top_scorer_club: topClub,
      total_market_value: totalMarketValue
    };

    return new Response(JSON.stringify(result,null,2),{
      headers:{ "content-type":"application/json"}
    });

  }
};