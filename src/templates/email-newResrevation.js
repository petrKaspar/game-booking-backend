export const gameItemTemplate = (imageUrl, gameSource, gameName, gameNote, gameAppLink, thirdColumn) => '</table>' + 
	'<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' + 
	'<tbody>' + 
	'<tr>' + 
	'<td>' + 
	'<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000;" width="680">' + 
	'<tbody>' + 
	'<tr>' + 
	'<td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-left: 10px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="25%">' + 
	'<table border="0" cellpadding="0" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' + 
	'<tr>' + 
	'<td style="padding-bottom:25px;padding-left:20px;padding-right:20px;padding-top:25px;width:100%;">' + 
	`<div align="center" style="line-height:10px"><a href="${gameAppLink}" style="outline:none" tabindex="-1" target="_blank"><img alt="Gamge logo" class="fullMobileWidth big" src="${imageUrl}" style="display: block; height: auto; border: 0; width: 120px; max-width: 100%;" title="${gameName}" width="120"/></a></div>` + 
	'</td>' + 
	'</tr>' + 
	'</table>' + 
	'</td>' + 
	'<td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">' + 
	'<table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">' + 
	'<tr>' + 
	'<td style="padding-bottom:10px;padding-left:30px;padding-right:10px;padding-top:40px;">' + 
	'<div style="font-family: sans-serif">' + 
	'<div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #232323; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">' + 
	`<p style="margin: 0; font-size: 14px;"><span style="font-size:17px;"><b><a href="${gameSource}" style="outline:none" tabindex="-1" target="_blank">${gameName}</a></b></span></p>` + 
	'</div>' + 
	'</div>' + 
	'</td>' + 
	'</tr>' + 
	'</table>' + 
	'<table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">' + 
	'<tr>' + 
	'<td style="padding-left:30px;padding-right:10px;padding-top:10px;padding-bottom:5px;">' + 
	'<div style="font-family: sans-serif">' + 
	'<div style="font-size: 12px; mso-line-height-alt: 18px; color: #848484; line-height: 1.5; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">' + 
	`<p style="margin: 0; font-size: 14px; mso-line-height-alt: 21px;"><span style="font-size:14px;">${gameNote}</span></p>` + 
	'</div>' + 
	'</div>' + 
	'</td>' + 
	'</tr>' + 
	'</table>' + 
	'</td>' + 
	'<td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="25%">' + 
	'<div class="spacer_block" style="height:5px;line-height:5px;font-size:1px;"> </div>' + 
	'<div class="spacer_block mobile_hide" style="height:30px;line-height:30px;font-size:1px;"> </div>' + 
	'<table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">' + 
	'<tr>' + 
	'<td style="padding-bottom:15px;padding-left:30px;padding-right:10px;padding-top:10px;">' + 
	'<div style="font-family: sans-serif">' + 
	'<div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">' + 
	`<p style="margin: 0; font-size: 14px;">${thirdColumn}</p>` + 
	'</div>' + 
	'</div>' + 
	'</td>' + 
	'</tr>' + 
	'</table>' + 
	'</td>' + 
	'</tr>' + 
	'</tbody>' + 
	'</table>' + 
	'</td>' + 
	'</tr>' + 
	'</tbody>';


export const newReservationEmailTemplate = (mainTitle, subtitle, userName, userEmail, message, gameItemsArray, footerMessage) =>  '' + 
'<!DOCTYPE html>' + 
'' + 
'<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">' + 
'<head>' + 
'<title></title>' + 
'<meta charset="utf-8"/>' + 
'<meta content="width=device-width, initial-scale=1.0" name="viewport"/>' + 
'<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->' + 
'<!--[if !mso]><!-->' + 
'<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css"/>' + 
'<!--<![endif]-->' + 
'<style>' + 
'		* {' + 
'			box-sizing: border-box;' + 
'		}' + 
'' + 
'		body {' + 
'			margin: 0;' + 
'			padding: 0;' + 
'		}' + 
'' + 
'		/*th.column{' + 
'	padding:0' + 
'}*/' + 
'' + 
'		a[x-apple-data-detectors] {' + 
'			color: inherit !important;' + 
'			text-decoration: inherit !important;' + 
'		}' + 
'' + 
'		#MessageViewBody a {' + 
'			color: inherit;' + 
'			text-decoration: none;' + 
'		}' + 
'' + 
'		p {' + 
'			line-height: inherit' + 
'		}' + 
'' + 
'		@media (max-width:700px) {' + 
'			.icons-inner {' + 
'				text-align: center;' + 
'			}' + 
'' + 
'			.icons-inner td {' + 
'				margin: 0 auto;' + 
'			}' + 
'' + 
'			.fullMobileWidth,' + 
'			.row-content {' + 
'				width: 100% !important;' + 
'			}' + 
'' + 
'			.image_block img.big {' + 
'				width: auto !important;' + 
'			}' + 
'' + 
'			.mobile_hide {' + 
'				display: none;' + 
'			}' + 
'' + 
'			.stack .column {' + 
'				width: 100%;' + 
'				display: block;' + 
'			}' + 
'' + 
'			.mobile_hide {' + 
'				min-height: 0;' + 
'				max-height: 0;' + 
'				max-width: 0;' + 
'				overflow: hidden;' + 
'				font-size: 0px;' + 
'			}' + 
'		}' + 
'	</style>' + 
'</head>' + 
'<body style="margin: 0; background-color: #ffffff; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">' + 
'<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;" width="100%">' + 
'<tbody>' + 
'<tr>' + 
'<td>' + 
'<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #89d5a0;" width="100%">' + 
'<tbody>' + 
'<tr>' + 
'<td>' + 
'<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000;" width="900">' + 
'<tbody>' + 
'<tr>' + 
'<td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">' + 
'<table border="0" cellpadding="0" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' + 
'<tr>' + 
'<td style="width:100%;padding-right:0px;padding-left:0px;padding-top:25px;">' + 
'<div align="center" style="line-height:10px"><a href="https://udkh.cz/#/games/admin2" style="outline:none" tabindex="-1" target="_blank"><img alt="ÚDKH při VŠCHT Praha" src="https://game-booking-backend.herokuapp.com/public/images/cart.png" style="display: block; height: auto; border: 0; width: 210px; max-width: 100%;" title="Cool Burger Walking" width="210"/></a></div>' + 
'</td>' + 
'</tr>' + 
'</table>' + 
'<table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">' + 
'<tr>' + 
'<td style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:30px;">' + 
'<div style="font-family: sans-serif">' + 
'<div style="font-size: 14px; mso-line-height-alt: 16.8px; color: #0e1309; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;">' + 
`<p style="margin: 0; font-size: 14px; text-align: center;"><strong><span style="font-size:38px;">${mainTitle}<br/></span></strong></p>` + 
'</div>' + 
'</div>' + 
'</td>' + 
'</tr>' + 
'</table>' + 
'<table class="-wm-text_block" style="mso-table-lspace:0pt;mso-table-rspace:0pt;word-break:break-word" width="100%" cellspacing="0" cellpadding="0" border="0">'+
'<tbody>'+
'<tr>'+
'<td style="padding-bottom:20px;padding-left:60px;padding-right:60px;padding-top:10px">'+
'<div style="font-family:sans-serif">'+
'<div style="font-size:12px;font-family:Montserrat,Trebuchet MS,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Tahoma,sans-serif;mso-line-height-alt:21.6px;color:#0e1309;line-height:1.8">'+
`<p style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:32.4px"><span style="font-size:18px">${subtitle}</span></p>`+
'</div>'+
'</div>'+
'</td>'+
'</tr>'+
'</tbody>'+
'</table>'+
'<table border="0" cellpadding="10" cellspacing="0" class="button_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' + 
'<tr>' + 
'<td>' + 
'<div align="center">' + 
'<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://udkh.cz/#/games/admin2" style="height:43px;width:220px;v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#ffffff"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#33563c; font-family:Tahoma, sans-serif; font-size:16px"><![endif]--><a href="https://udkh.cz/#/games/admin2" style="text-decoration:none;display:inline-block;color:#33563c;background-color:#ffffff;border-radius:4px;width:auto;border-top:0px solid #8a3b8f;border-right:0px solid #8a3b8f;border-bottom:0px solid #8a3b8f;border-left:0px solid #8a3b8f;padding-top:5px;padding-bottom:5px;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:40px;padding-right:40px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><strong>Vstup do aplikace<br/></strong></span></span></a>' + 
'<!--[if mso]></center></v:textbox></v:roundrect><![endif]-->' + 
'</div>' + 
'</td>' + 
'</tr>' + 
'</table>' + 
'</td>' + 
'</tr>' + 
'</tbody>' + 
'</table>' + 
'</td>' + 
'</tr>' + 
'</tbody>' + 
'</table>' + 
'<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' + 
'<tbody>' + 
'<tr>' + 
'<td>' + 
'<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000;" width="680">' + 
'<tbody>' + 
'<tr>' + 
'<td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">' + 
'<table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">' + 
'<tr>' + 
'<td style="padding-bottom:5px;padding-left:30px;padding-right:30px;padding-top:15px;">' + 
'<div style="font-family: sans-serif">' + 
'<div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 21.6px; color: #33563c; line-height: 1.8;">' + 
'<p style="margin: 0; font-size: 14px; text-align: left;"><strong><span style="font-size:16px;">Jméno hráče:</span></strong></p>' + 
'</div>' + 
'</div>' + 
'</td>' + 
'</tr>' + 
'</table>' + 
'<table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">' + 
'<tr>' + 
'<td style="padding-bottom:10px;padding-left:30px;padding-right:30px;padding-top:10px;">' + 
'<div style="font-family: sans-serif">' + 
'<div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 21.6px; color: #33563c; line-height: 1.8;">' + 
'<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 28.8px;"><span style="font-size:16px;"><strong><span style="">E-mail hráče</span></strong></span></p>' + 
'</div>' + 
'</div>' + 
'</td>' + 
'</tr>' + 
'</table>' + 
'<table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">' + 
'<tr>' + 
'<td style="padding-bottom:15px;padding-left:30px;padding-right:30px;padding-top:10px;">' + 
'<div style="font-family: sans-serif">' + 
'<div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 21.6px; color: #33563c; line-height: 1.8;">' + 
'<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 28.8px;"><span style="font-size:16px;"><strong><span style="">Zpráva od hráče:<br/></span></strong></span></p>' + 
'</div>' + 
'</div>' + 
'</td>' + 
'</tr>' + 
'</table>' + 
'</td>' + 
'<td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">' + 
'<table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">' + 
'<tr>' + 
'<td style="padding-bottom:5px;padding-left:30px;padding-right:30px;padding-top:15px;">' + 
'<div style="font-family: sans-serif">' + 
'<div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 21.6px; color: #33563c; line-height: 1.8;">' + 
`<p style="margin: 0; font-size: 14px; text-align: left;"><strong><span style="font-size:16px;">${userName}</span></strong></p>` + 
'</div>' + 
'</div>' + 
'</td>' + 
'</tr>' + 
'</table>' + 
'<table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">' + 
'<tr>' + 
'<td style="padding-bottom:5px;padding-left:30px;padding-right:30px;padding-top:10px;">' + 
'<div style="font-family: sans-serif">' + 
'<div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 21.6px; color: #33563c; line-height: 1.8;">' + 
`<p style="margin: 0; font-size: 14px; text-align: left;"><strong><span style="font-size:16px;">${userEmail}</span></strong></p>` + 
'</div>' + 
'</div>' + 
'</td>' + 
'</tr>' + 
'</table>' + 
'<table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">' + 
'<tr>' + 
'<td style="padding-bottom:10px;padding-left:30px;padding-right:30px;padding-top:10px;">' + 
'<div style="font-family: sans-serif">' + 
'<div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 21.6px; color: #33563c; line-height: 1.8;">' + 
`<p style="margin: 0; font-size: 14px; text-align: left;"><strong><span style="font-size:16px;">${message}</span></strong></p>` + 
'</div>' + 
'</div>' + 
'</td>' + 
'</tr>' + 
'</table>' + 
'</td>' + 
'</tr>' + 
'</tbody>' + 
'</table>' + 
'</td>' + 
'</tr>' + 
'</tbody>' + 
'</table>' + 
'<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' + 
'<tbody>' + 
'<tr>' + 
'<td>' + 
'<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000;" width="680">' + 
'<tbody>' + 
'<tr>' + 
'<td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">' + 
'<table border="0" cellpadding="10" cellspacing="0" class="divider_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' + 
'<tr>' + 
'<td>' + 
'<div align="center">' + 
'<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' + 
'<tr>' + 
'<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;"><span> </span></td>' + 
'</tr>' + 
'</table>' + 
'</div>' + 
'</td>' + 
'</tr>' + 
'</table>' + 
'</td>' + 
'</tr>' + 
'</tbody>' + 
'</table>' + 
'</td>' + 
'</tr>' + 
'</tbody>' + 
'</table>' + 
'<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' + 
'<tbody>' + 
'<tr>' + 
'<td>' + 
'<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000;" width="680">' + 
'<tbody>' + 
'<tr>' + 
'<td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">' + 
'<table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">' + 
'<tr>' + 
'<td style="padding-bottom:5px;padding-left:30px;padding-right:30px;padding-top:10px;">' + 
'<div style="font-family: sans-serif">' + 
'<div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 21.6px; color: #33563c; line-height: 1.8;">' + 
'<p style="margin: 0; font-size: 14px; text-align: left;"><strong><span style="font-size:16px;">Seznam rezervovaných her:</span></strong></p>' + 
'</div>' + 
'</div>' + 
'</td>' + 
'</tr>' + 
'</table>' + 
'</td>' + 
'</tr>' + 
'</tbody>' + 
'</table>' + 
'</td>' + 
'</tr>' + 
'</tbody>' + 
`${gameItemsArray}` +
'</table>' + 
'<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-8" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' + 
'<tbody>' + 
'<tr>' + 
'<td>' + 
'<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000;" width="680">' + 
'<tbody>' + 
'<tr>' + 
'<td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">' + 
'<table border="0" cellpadding="10" cellspacing="0" class="divider_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' + 
'<tr>' + 
'<td>' + 
'<div align="center">' + 
'<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' + 
'<tr>' + 
'<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;"><span> </span></td>' + 
'</tr>' + 
'</table>' + 
'</div>' + 
'</td>' + 
'</tr>' + 
'</table>' + 
'</td>' + 
'</tr>' + 
'</tbody>' + 
'</table>' + 





'<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' + 
'<tbody>' + 
'<tr>' + 
'<td>' + 
'<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000;" width="680">' + 
'<tbody>' + 
'<tr>' + 
'<td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">' + 
'<table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">' + 
'<tr>' + 
'<td style="padding-bottom:10px;padding-left:30px;padding-right:30px;padding-top:10px;">' + 
'<div style="font-family: sans-serif">' + 
'<div style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 21.6px; color: #33563c; line-height: 1.8;">' + 
`<p style="margin: 0; font-size: 14px; text-align: left;"><strong><span style="font-size:16px;">${footerMessage}</span></strong></p>` + 
'</div>' + 
'</div>' + 
'</td>' + 
'</tr>' + 
'</table>' + 
'</td>' + 
'</tr>' + 
'</tbody>' + 
'</table>' + 
'</td>' + 
'</tr>' + 
'</tbody>' + 
'</table>' + 





'</td>' + 
'</tr>' + 
'</tbody>' + 
'</body>' + 
'</html>';
