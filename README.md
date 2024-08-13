# AWS Bedrock Generative AI POC

## Overview

This project is a proof of concept (POC) to explore and practice using AWS Bedrock with various generative AI models, including:

-   **amazon.titan-image-generator-v1**: For generating images from text prompts.
-   **amazon.titan-text-express-v1**: For generating text based on given inputs.

Additionally, this project focuses on creating reusable AWS CDK stacks for common AWS services such as Lambda functions, S3 buckets, and API Gateway. The goal is to streamline the deployment and management of these services in a structured and efficient manner.

## Objectives

1. **AWS Bedrock Integration**:

    - Practice using AWS Bedrock's generative AI models.
    - Explore the capabilities and limitations of the amazon.titan models.

2. **AWS CDK Stacks**:

    - Develop reusable AWS CDK stacks for deploying Lambda functions, S3 buckets, and API Gateway.
    - Ensure that these stacks are modular and can be easily integrated into other projects.

3. **LangChain Library**:
    - Experiment with the LangChain library to facilitate interaction with AI models.
    - Implement workflows that leverage LangChain for advanced AI-driven tasks.

## Getting Started

### Prerequisites

-   **AWS CLI**: Ensure you have the AWS CLI installed and configured with appropriate credentials.
-   **AWS CDK**: Install the AWS CDK if not already installed.
-   **Bootstrap CDK**: Bootstrap the CDK environment `cdk bootstrap`
-   **Node.js**: Required for running CDK and deploying Lambda functions.

### Installation

```bash
1. git clone https://github.com/leonardoas10/aws-bedrock-generative-ai.git
2. npm i
3. cd src/practice-bedrock/cdk && npm i
4. cdk deploy --all
```
