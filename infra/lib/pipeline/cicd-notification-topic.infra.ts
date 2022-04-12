import { ChatbotSlackConfiguration } from '@infra/common/enums/chatbot-slack-configuration.enum';
import { Stack } from 'aws-cdk-lib';
import { SlackChannelConfiguration } from 'aws-cdk-lib/aws-chatbot';
import { Topic } from 'aws-cdk-lib/aws-sns';

type CicdNotificationTopic = {
  cicdNotificationsTopic: Topic,
  cicdChatbotSlackConfig: SlackChannelConfiguration
}

export const cicdNotificationTopic = (scope: Stack): CicdNotificationTopic => {
  const cicdNotificationsTopic = new Topic(scope, 'CDKTEST-CicdNotifications');

  const cicdChatbotSlackConfig = new SlackChannelConfiguration(scope, 'CDKTEST-ChatbotSlackNotifications', {
    slackChannelConfigurationName: `${scope.stackName}-cicd-notifications`,
    slackWorkspaceId: ChatbotSlackConfiguration.slackWorkspaceId,
    slackChannelId: ChatbotSlackConfiguration.slackNodiensTeamCicdChannelId,
    notificationTopics: [cicdNotificationsTopic]
  });

  return {
    cicdNotificationsTopic,
    cicdChatbotSlackConfig
  };
};
