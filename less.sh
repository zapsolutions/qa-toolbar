while inotifywait -r /srv/www/li423-161.members.linode.com/public_html/maestro/app/webroot/js/qa/css; do
    lessc -x /srv/www/li423-161.members.linode.com/public_html/maestro/app/webroot/js/qa/css/style.less /srv/www/li423-161.members.linode.com/public_html/maestro/app/webroot/js/qa/css/style.css;
    lessc -x /srv/www/li423-161.members.linode.com/public_html/maestro/app/webroot/js/qa/css/demo.less /srv/www/li423-161.members.linode.com/public_html/maestro/app/webroot/js/qa/css/demo.css;
done