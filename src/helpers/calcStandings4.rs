fn calc_standings4(match_results: &Vec<HashMap<&str, &str>>) -> Vec<HashMap<&str, &str>> {
    let mut standings: HashMap<&str, HashMap<&str, i32>> = HashMap::new();

    for match_result in match_results {
        let home_team = match_result.get("homeTeam").unwrap();
        let away_team = match_result.get("awayTeam").unwrap();
        let home_score = match_result
            .get("homeScore")
            .unwrap()
            .parse::<i32>()
            .unwrap();
        let away_score = match_result
            .get("awayScore")
            .unwrap()
            .parse::<i32>()
            .unwrap();
        let home_crest = match_result.get("homeCrest").unwrap();
        let away_crest = match_result.get("awayCrest").unwrap();

        *standings.entry(home_team).or_insert(HashMap::new()) = {
            let mut home_team_stats = standings.entry(home_team).or_insert(HashMap::new());
            home_team_stats.insert("crest", home_crest.parse::<i32>().unwrap());
            home_team_stats.insert("gp", home_team_stats.get("gp").unwrap_or(&0) + 1);
            home_team_stats.insert(
                "goalsScored",
                home_team_stats.get("goalsScored").unwrap_or(&0) + home_score,
            );
            home_team_stats.insert(
                "goalsConceded",
                home_team_stats.get("goalsConceded").unwrap_or(&0) + away_score,
            );
            home_team_stats.insert(
                "points",
                home_team_stats.get("points").unwrap_or(&0)
                    + if home_score > away_score {
                        3
                    } else if home_score == away_score {
                        1
                    } else {
                        0
                    },
            );
            home_team_stats.clone()
        };

        *standings.entry(away_team).or_insert(HashMap::new()) = {
            let mut away_team_stats = standings.entry(away_team).or_insert(HashMap::new());
            away_team_stats.insert("crest", away_crest.parse::<i32>().unwrap());
            away_team_stats.insert("gp", away_team_stats.get("gp").unwrap_or(&0) + 1);
            away_team_stats.insert(
                "goalsScored",
                away_team_stats.get("goalsScored").unwrap_or(&0) + away_score,
            );
            away_team_stats.insert(
                "goalsConceded",
                away_team_stats.get("goalsConceded").unwrap_or(&0) + home_score,
            );
            away_team_stats.insert(
                "points",
                away_team_stats.get("points").unwrap_or(&0)
                    + if away_score > home_score {
                        3
                    } else if away_score == home_score {
                        1
                    } else {
                        0
                    },
            );
            away_team_stats.clone()
        };
    }

    let mut sorted_standings: Vec<HashMap<&str, &str>> = standings
        .iter()
        .map(|(team, stats)| {
            stats
                .iter()
                .map(|(k, v)| (*k, v.to_string().as_str()))
                .chain(std::iter::once(("team", team)))
                .collect()
        })
        .collect();

    sorted_standings.sort_by(|a, b| {
        b.get("points")
            .unwrap()
            .parse::<i32>()
            .unwrap()
            .cmp(&a.get("points").unwrap().parse::<i32>().unwrap())
            .then_with(|| {
                (b.get("goalsScored").unwrap().parse::<i32>().unwrap()
                    - b.get("goalsConceded").unwrap().parse::<i32>().unwrap())
                .cmp(
                    &(a.get("goalsScored").unwrap().parse::<i32>().unwrap()
                        - a.get("goalsConceded").unwrap().parse::<i32>().unwrap()),
                )
            })
    });

    sorted_standings
}
