require("./src/tools-for-instagram.js");
const rules = require("./rules.json");
const {
  hashtags,
  intervals,
  likesPerInterval,
  followsPerInterval,
  waitMinutesBetweenLikes,
  waitMinutesBetweenFollows,
} = rules;

(async () => {
  let ig = await login();
  await setAntiBanMode(ig);

  // Metti like automaticamente agli ultimi post contenenti gli hashtag selezionati
  let likeInterval = likeRecentHashtagsByIntervals(
    ig,
    hashtags,
    intervals,
    likesPerInterval,
    waitMinutesBetweenLikes
  );

  // let followInterval = followRecentHashtagsByIntervals(
  //   ig,
  //   hashtags,
  //   intervals,
  //   followsPerInterval,
  //   waitMinutesBetweenFollows
  // );

  process.on("unhandledRejection", async function (err) {
    console.log(err.response.body);
    if (err.name == "IgActionSpamError" || err.spam == true) {
      console.log("Spam Error, trying to regenerate the cookie".red);
      await removeCookie(ig);
      ig = await login();
    }
  });
})();
