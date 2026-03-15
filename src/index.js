export default {
  async fetch(request, env, ctx) {

    const csv = await fetch(new URL("/league_data.csv", request.url))
      .then(res => res.text());

    // split aman untuk Windows CSV
    const lines = csv.trim().split(/\r?\n/);

    // ambil header
    const headers = lines[0].split(",");

    // ambil data
    const rows = lines.slice(1);

    const data = rows.map(row => {
      const col = row.split(",");

      return {
        Country: col[0]?.trim(),
        League: col[1]?.trim(),
        Club: col[2]?.trim(),
        Player: col[3]?.trim(),
        Matches_Played: Number(col[4]),
        Substitution: Number(col[5]),
        Mins: Number(col[6]),
        Goals: Number(col[7]),
        xG: Number(col[8]),
        Shots: Number(col[10]),
        OnTarget: Number(col[11]),
        Year: Number(col[14]),
        Value: Number(col[15])
      };
    });

    const totalPlayers = data.length;

    const totalGoals = data.reduce((a,b)=>a+(b.Goals||0),0);
    const totalShots = data.reduce((a,b)=>a+(b.Shots||0),0);
    const totalValue = data.reduce((a,b)=>a+(b.Value||0),0);

    const avgGoals = totalGoals / totalPlayers;
    const avgShots = totalShots / totalPlayers;

    // cari negara terbanyak
    const countryCount = {};
    data.forEach(d=>{
      countryCount[d.Country] = (countryCount[d.Country] || 0) + 1;
    });

    const topCountry = Object.keys(countryCount)
      .reduce((a,b)=> countryCount[a] > countryCount[b] ? a : b);

    // club top scorer
    const clubGoals = {};
    data.forEach(d=>{
      clubGoals[d.Club] = (clubGoals[d.Club] || 0) + (d.Goals||0);
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
      total_market_value: totalValue
    };

    return new Response(JSON.stringify(result,null,2),{
      headers: { "Content-Type":"application/json"}
    });

  }
};