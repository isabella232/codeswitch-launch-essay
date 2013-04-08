#!/usr/bin/env python

"""
Project-wide application configuration.

DO NOT STORE SECRETS, PASSWORDS, ETC. IN THIS FILE.
They will be exposed to users. Use environment variables instead.
"""

import os

PROJECT_NAME = 'This is a test name.'
PROJECT_SLUG = 'test-slug-headline-name'
REPOSITORY_NAME = 'test-name-1'

PRODUCTION_S3_BUCKETS = ['apps.npr.org', 'apps2.npr.org']
STAGING_S3_BUCKETS = ['stage-apps.npr.org']

S3_BUCKETS = []


def configure_targets(deployment_target):
    """
    Configure deployment targets. Abstracted so this can be
    overriden for rendering before deployment.
    """
    global S3_BUCKETS
    global SERVERS
    global DEBUG

    if deployment_target == 'production':
        S3_BUCKETS = PRODUCTION_S3_BUCKETS
        DEBUG = False
    else:
        S3_BUCKETS = STAGING_S3_BUCKETS
        DEBUG = True

DEPLOYMENT_TARGET = os.environ.get('DEPLOYMENT_TARGET', None)

configure_targets(DEPLOYMENT_TARGET)
