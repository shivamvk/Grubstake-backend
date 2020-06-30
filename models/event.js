const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  isActive: {
    type: Boolean,
    default: true,
  },
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  basicDetails: {
    basics: {
      logo: {
        type: String,
      },
      orgName: {
        type: String,
      },
      title: {
        type: String,
      },
      type: {
        type: String,
      },
    },
    date: {
      endDate: {
        type: String,
        default: null,
      },
      startDate: {
        type: String,
      },
    },
    links: {
      facebook: {
        type: String,
        default: null,
      },
      instagram: {
        type: String,
        default: null,
      },
      website: {
        type: String,
        default: null,
      },
    },
    location: {
      address: {
        type: String,
      },
      city: {
        type: String,
      },
    },
    time: {
      startTime: {
        type: String,
      },
      endTime: {
        type: String,
      },
    },
  },
  packages: [
    {
      sponsorOfferDetails: {
        offers: [{ type: String }],
        others: {
          type: String,
          default: null,
        },
        title: {
          type: String,
        },
      },
      sponsorRequestDetails: {
        selection: {
          type: String,
        },
        inCash: {
          min: {
            type: Number,
          },
          max: {
            type: Number,
          },
        },
        inKind: {
          couponsRange: {
            min: {
              type: Number,
            },
            max: {
              type: Number,
            },
          },
          vouchersRange: {
            min: {
              type: Number,
            },
            max: {
              type: Number,
            },
          },
          goodiesRange: {
            min: {
              type: Number,
            },
            max: {
              type: Number,
            },
          },
        },
      },
    },
  ],
  audienceDetails: {
    expectedFootfall: {
      type: Number,
    },
    audienceTypes: [
      {
        type: String,
      },
    ],
  },
});

eventSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Event", eventSchema);
