import { collectInterests } from "../services/feed/collectInterests.service.js";
import { rankContents } from "../services/feed/rankContents.service.js";
// import { getTopInterests } from "../../services/feed/interestService.js";
// import { getFeedContents } from "../../services/feed/feedContentsService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getFeed = async (req, res) => {
  // TODO: Add logic to get the feed for the user
  // Get the interactions, extract posts and clips and pass to ranking service
  // Get the top scored contents from the ranking service
  // Pass the contents to the interest service
  // Get the top and common 6 interests from the interest service
  // Pass the interests to search interest service for querying
  // Get top 30 posts and 30 clips from the search interest service
  // Return the new contents to the feed

  const interactions = {
    uid: "123-abc-def",
    posts: [
      {
        id: "abc-def-123",
        interests: ["technology", "music", "cars"],
        engagement: {
          view: true,
          like: true,
          comment: false,
          share: false,
        },
      },
      {
        id: "jkl-ghi-456",
        interests: ["travel", "food", "music"],
        engagement: {
          view: true,
          like: true,
          comment: true,
          share: true,
        },
      },
      {
        id: "kerl-pqr-789",
        interests: ["art", "design", "tunes"],
        engagement: {
          view: true,
          like: false,
          comment: false,
          share: true,
        },
      },
      {
        id: "567-ope-90o",
        interests: ["fashion", "dust", "rhythm"],
        engagement: {
          view: true,
          like: true,
          comment: true,
          share: true,
        },
      },
      {
        id: "901-tuv-wxyz",
        interests: ["cooking", "design", "fitness"],
        engagement: {
          view: true,
          like: false,
          comment: true,
          share: true,
        },
      },
    ],
    clips: [
      {
        id: "bnts-1234-klmn",
        interests: ["politics", "documentary", "history"],
        engagement: {
          view: true,
          like: true,
          comment: true,
          share: true,
        },
      },
      {
        id: "1234-olmk-powq",
        interests: ["sports", "fitness", "wellness"],
        engagement: {
          view: true,
          like: false,
          comment: false,
          share: true,
        },
      },
      {
        id: "tqrs-6789-uvwx",
        interests: ["music", "improvisation", "theater"],
        engagement: {
          view: true,
          like: true,
          comment: true,
          share: false,
        },
      },
      {
        id: "lmno-1234-qrst",
        interests: ["technology", "gaming", "VR"],
        engagement: {
          view: true,
          like: false,
          comment: true,
          share: true,
        },
      },
    ],
  };
  

  // const { uid, posts, clips } = req.body.interactions;
  const { uid, posts, clips } = interactions;

  const rankedPosts = await rankContents(posts);
  const rankedClips = await rankContents(clips);

  const postsTopInterests = await collectInterests(rankedPosts);
  const clipsTopInterests = await collectInterests(rankedClips);
  
  const feedPosts = await getFeedContents(postsTopInterests);
  const feedClips = await getFeedContents(clipsTopInterests);

  // return feedContents;
};

getFeed() // CAUTION: Experimental Call
