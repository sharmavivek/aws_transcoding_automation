var aws = require('aws-sdk'); 
var elastictranscoder = new aws.ElasticTranscoder();

 
// return basename without extension
function basename(path) { 
   return path.split('/').pop().split('.')[0];
}

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticTranscoder.html

exports.handler = function(event, context) { 
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    // Get the object from the event and show its content type
    var key = event.Records[0].s3.object.key;

    var params = {
        Input: {
            Key: key
        },
    // replace this with your pipeline-id from Console
        PipelineId: '_your_pipeline_id', 

    //      If in case you prefix a folder name or a string before each file.   
    //      OutputKeyPrefix: 'hls-output/',
        Outputs: [
            {
                Key: basename(key) + '_16_',
                PresetId: '_your_preset_id_a',
                SegmentDuration: '6'
            },
            {
                Key: basename(key) + '_64_',
                PresetId: '_your_preset_id_b',
                SegmentDuration: '6'
            },
            {
                Key: basename(key) + '_128_',
                PresetId: '_your_preset_id_c',
                SegmentDuration: '6'
            },
            {
                Key: basename(key) + '_192_',
                PresetId: '_your_preset_id_d',
                SegmentDuration: '6'
            },
            {
                Key: basename(key) + '_16.mp4',
                PresetId: '_your_preset_id_mp4_a',
            },
            {
                Key: basename(key) + '_64.mp4',
                PresetId: '_your_preset_id_mp4_b',
            },
            {
                Key: basename(key) + '_96.mp4',
                PresetId: '_your_preset_id_mp4_c',
            },
            {
                Key: basename(key) + '_192.mp4',
                PresetId: '_your_preset_id_mp4_d',
            }
        ],
        Playlists: [
            {
                Name: basename(key) + '_free',
                Format: 'HLSv3',
                OutputKeys: [
                    basename(key) + '_16_', 
                    basename(key) + '_64_', 
                    basename(key) + '_128_'
                ]
            },
            {
                Name: basename(key) + '_premium',
                Format: 'HLSv3',
                OutputKeys: [
                    basename(key) + '_16_', 
                    basename(key) + '_64_', 
                    basename(key) + '_128_',
                    basename(key) + '_192_'
                ]
            },
        ]
    };

 // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticTranscoder.html#createJob-property 
    elastictranscoder.createJob(params, function(err, data) {
      if (err){
        console.log(err, err.stack); // an error occurred
        context.fail();
        return;
      }
      context.succeed();
    });
};


/* Event Dump
{
    "Records": [
        {
            "eventVersion": "2.0",
            "eventSource": "aws:s3",
            "awsRegion": "us-east-1",
            "eventTime": "2018-01-08T10:34:15.361Z",
            "eventName": "ObjectCreated:Put",
            "userIdentity": {
                "principalId": "AWS:_your_pipeline_id"
            },
            "requestParameters": {
                "sourceIPAddress": "72.your.ip.67"
            },
            "responseElements": {
                "x-amz-request-id": "dummy_request_id",
                "x-amz-id-2": "dummy_request_id_dummy_request_id"
            },
            "s3": {
                "s3SchemaVersion": "1.0",
                "configurationId": "36026a5e-aqe-eqwr-tqer-2d4a7bff9657",
                "bucket": {
                    "name": "_your_bucket_name",
                    "ownerIdentity": {
                        "principalId": "_your_principalId_name"
                    },
                    "arn": "arn:aws:s3:::_your_bucket_name"
                },
                "object": {
                    "key": "hls-upload/Jan08-2.mp4",
                    "size": 383631,
                    "eTag": "etag12456789123456789",
                    "sequencer": "12456789123456789"
                }
            }
        }
    ]
}


*/
