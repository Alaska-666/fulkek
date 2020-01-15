module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        plugins: [
                            ["import", {"libraryName": "antd", style: true}]
                        ]
                    }
                }
            }, {
                test: /\.less$/,
                use: ["style-loader", 'css-loader', {loader: "less-loader", options: {javascriptEnabled: true}}]
        }, {
                test: /\.css$/,
                use: [{
                        loader: 'style-loader'
                      }, {
                        loader: 'css-loader',
                        options: {
				    	sourceMap: true
				      }
			    }]
            }, {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    'url-loader',
                ],
            }
        ]
    },
};

