const router = require('express').Router();
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

aws.config.update({
    secretAccessKey: 'oKCfiEs1Vi5o80Vj+YihzgXvYGpNv4NMbN/Yx7/w',
    accessKeyId: 'AKIA3M7BLS63N2CDCJMM',
    region: 'ap-southeast-1', 
    signatureVersion: 'v4',
});

const s3 = new aws.S3();


router.route('/generatepresignedurl')
    .get((req,res)=>{
        var fileurls = [];

        const params = {
            Bucket: 'personals3bucket-dkb.01.development',
            Key: req.query.fileName,
            Expires: 40 * 60, // Time untill presigned URL is valid
            ACL: 'public-read',
            ContentType: req.query.fileType
        };

        s3.getSignedUrl('putObject', params, function async(err, url) {
            if (err) {
                res.json({
                    success: false, message: 'Pre- Signed URL error', urls: fileurls
                });
            }
            else {
                fileurls[0] = url;
                res.json({ success: true, message: 'AWS SDK S3 Pre-signed urls generated successfully', urls: fileurls });
            }
        });
    })

module.exports = router;