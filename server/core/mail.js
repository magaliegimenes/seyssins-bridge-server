const config = require('config');
const rp = require('request-promise');

const CAMPAIGN = 'campaigns';
const EDIT_CONTENT = 'content';
const SEND_ACTION = 'actions/send';

const LIST = 'lists';
const MEMBERS = 'members';

module.exports.createCampaign = (subject, content) => {
  if (!config.get('email').enabled) {
    console.log('Mail sending process is disabled.');
    return Promise.resolve();
  }
  let campaignId;
  const campaignURL = `${config.get('email').mailChimpURL}/${CAMPAIGN}`;
  const createCampaignOptions = {
    method: 'POST',
    uri: campaignURL,
    headers: {
      Authorization: `apikey ${process.env.MAIL_CHIMP_API}`
    },
    body: {
      recipients: {list_id: config.get('email').mailChimpList},
      type: 'regular',
      settings: {
        subject_line: subject,
        reply_to: config.get('email').from,
        from_name: config.get('email').fromName
      }
    },
    json: true // Automatically stringifies the body to JSON
  };

  return rp(createCampaignOptions)
    .then((campaign) => {
      campaignId = campaign.id;
      const editCampaignOptions = {
        method: 'PUT',
        uri: `${campaignURL}/${campaignId}/${EDIT_CONTENT}`,
        headers: {
          Authorization: `apikey ${process.env.MAIL_CHIMP_API}`
        },
        body: {
          html: content
        },
        json: true
      };
      return rp(editCampaignOptions);
    })
    .then(() => {
      const sendCampaignOptions = {
        method: 'POST',
        uri: `${campaignURL}/${campaignId}/${SEND_ACTION}`,
        headers: {
          Authorization: `apikey ${process.env.MAIL_CHIMP_API}`
        },
        body: {},
        json: true
      };
      return rp(sendCampaignOptions);
    })
    .then(() => console.log('Mail campaign was created and sent to user list'))
    .catch((err) => {
      console.log('An error occurred during campaign preparation');
      console.log(err);
    });
};

module.exports.addUserToList = (email) => {
  const newMemberURL = `${config.get('email').mailChimpURL}/${LIST}/${config.get('email').mailChimpList}/${MEMBERS}`;
  const createMemberOptions = {
    method: 'POST',
    uri: newMemberURL,
    headers: {
      Authorization: `apikey ${process.env.MAIL_CHIMP_API}`
    },
    body: {
      email_address: email,
      status: 'subscribed',
      language: 'fr'
    },
    json: true // Automatically stringifies the body to JSON
  };

  return rp(createMemberOptions)
    .then(() => console.log(`User ${email} was added to list`))
    .catch((err) => {
      console.log('An error occurred when user was added');
      console.log(err.error);
      throw err;
    });
};
