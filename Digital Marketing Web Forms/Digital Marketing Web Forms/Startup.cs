using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Digital_Marketing_Web_Forms.Startup))]
namespace Digital_Marketing_Web_Forms
{
    public partial class Startup {
        public void Configuration(IAppBuilder app) {
            ConfigureAuth(app);
        }
    }
}
