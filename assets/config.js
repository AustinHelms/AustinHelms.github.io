/* Chute Stack: settings for the new Resources pages.
   Leave a value empty ("") and the matching button or section shows a "not ready yet" state.
   Your existing forms (fit call, Missed-Call Test, calculator and guide) keep their own Make webhooks inside their sections. */

window.CHUTE = {
  // YouTube. Channel URL powers the Subscribe button on /resources/videos/.
  // Playlist ID is the part after "list=" in a playlist URL (starts with PL).
  youtubeChannelUrl: "",
  youtubePlaylistId: "",

  // Templates. Create a Stripe Payment Link per template and paste it as "stripe".
  // The key must match the data-stripe / data-price value on the product page.
  products: {
    "lead-follow-up-kit": {
      price: "$29",
      stripe: ""
    }
  }
};
